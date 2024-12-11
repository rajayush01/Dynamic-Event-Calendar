"use client";
import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import Dexie from "dexie";
import CalendarHeader from "./components/CalendarHeader";
import CalendarGrid from "./components/CalendarGrid";
import EventModal from "./components/EventModal";
import EventList from "./components/EventList";

// Initialize Dexie Database
const db = new Dexie("CalendarAppDB");
db.version(1).stores({
  events: "day, eventList", // "day" is the primary key
});

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    id: "",
    name: "",
    startTime: "",
    endTime: "",
    description: "",
    category: "personal",
    color: "#3B82F6",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  const CATEGORY_OPTIONS = [
    { label: "Personal", value: "personal", color: "#10B981" },
    { label: "Work", value: "work", color: "#3B82F6" },
    { label: "Others", value: "others", color: "#8B5CF6" },
  ];

  // Load events from Dexie DB on mount
  useEffect(() => {
    const fetchEvents = async () => {
      const allEvents = await db.events.toArray();
      const eventsObject = allEvents.reduce((acc, { day, eventList }) => {
        acc[day] = eventList;
        return acc;
      }, {});
      setEvents(eventsObject);
    };
    fetchEvents();
  }, []);

  // Save events to Dexie DB whenever `events` changes
  useEffect(() => {
    const saveEvents = async () => {
      await db.events.clear();
      const eventEntries = Object.entries(events).map(([day, eventList]) => ({
        day,
        eventList,
      }));
      await db.events.bulkPut(eventEntries);
    };
    saveEvents();
  }, [events]);

  const handlePrevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const handleDayClick = (day, event) => {
    if (event.detail === 1) {
      setSelectedDay(day);
    } else if (event.detail === 2) {
      setSelectedDay(day);
      setIsEditing(false);
      setModalData({
        id: crypto.randomUUID(),
        name: "",
        startTime: "",
        endTime: "",
        description: "",
        category: "personal",
        color: CATEGORY_OPTIONS.find((c) => c.value === "personal").color,
      });
      setIsModalOpen(true);
    }
  };

  const isEventOverlapping = (newEvent, existingEvents) => {
    return existingEvents.some(
      (event) =>
        (newEvent.startTime >= event.startTime &&
          newEvent.startTime < event.endTime) ||
        (newEvent.endTime > event.startTime &&
          newEvent.endTime <= event.endTime) ||
        (newEvent.startTime <= event.startTime &&
          newEvent.endTime >= event.endTime)
    );
  };

  const handleAddEvent = () => {
    if (!modalData.name || !modalData.startTime || !modalData.endTime) {
      alert("Please fill in all required fields");
      return;
    }

    if (selectedDay) {
      const newEvents = { ...events };
      const dayEvents = newEvents[selectedDay] || [];

      if (isEventOverlapping(modalData, dayEvents)) {
        alert(
          "This event overlaps with an existing event. Please choose a different time."
        );
        return;
      }

      newEvents[selectedDay] = [...dayEvents, modalData];

      setEvents(newEvents);
      resetModalData();
      setIsModalOpen(false);
    }
  };

  const handleEditEvent = () => {
    if (!selectedDay) return;

    const updatedEvents = { ...events };
    const dayEvents = updatedEvents[selectedDay] || [];

    const eventIndex = dayEvents.findIndex((e) => e.id === modalData.id);

    if (eventIndex === -1) return;

    const eventsToCheck = dayEvents.filter((e) => e.id !== modalData.id);
    if (isEventOverlapping(modalData, eventsToCheck)) {
      alert(
        "This event overlaps with an existing event. Please choose a different time."
      );
      return;
    }

    dayEvents[eventIndex] = modalData;
    updatedEvents[selectedDay] = dayEvents;

    setEvents(updatedEvents);
    resetModalData();
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleDeleteEvent = (day, id) => {
    const newEvents = { ...events };
    newEvents[day] = newEvents[day].filter((event) => event.id !== id);

    if (newEvents[day].length === 0) {
      delete newEvents[day];
    }

    setEvents(newEvents);
  };

  const filteredEvents = useMemo(() => {
    if (!filterKeyword) return events;

    const filteredEventsResult = {};

    Object.keys(events).forEach((day) => {
      const dayEvents = events[day].filter(
        (event) =>
          event.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
          event.description.toLowerCase().includes(filterKeyword.toLowerCase())
      );

      if (dayEvents.length > 0) {
        filteredEventsResult[day] = dayEvents;
      }
    });

    return filteredEventsResult;
  }, [events, filterKeyword]);

  const resetModalData = () => {
    setModalData({
      id: "",
      name: "",
      startTime: "",
      endTime: "",
      description: "",
      category: "personal",
      color: CATEGORY_OPTIONS.find((c) => c.value === "personal").color,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col justify-between items-center mb-4">
        <CalendarHeader
          currentDate={currentDate}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
        />
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Filter events..."
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            className="w-48 px-2 py-1 border rounded"
          />
        </div>
      </div>

      <CalendarGrid
        currentDate={currentDate}
        events={filteredEvents}
        handleDayClick={handleDayClick}
        selectedDay={selectedDay}
      />

      {selectedDay && (
        <EventList
          selectedDay={selectedDay}
          events={filteredEvents[selectedDay] || []}
          handleDeleteEvent={handleDeleteEvent}
          setModalData={(event) => {
            setModalData(event);
            setIsEditing(true);
            setIsModalOpen(true);
          }}
        />
      )}

      {isModalOpen && (
        <EventModal
          modalData={modalData}
          setModalData={setModalData}
          handleAddEvent={handleAddEvent}
          handleEditEvent={handleEditEvent}
          isEditing={isEditing}
          setIsModalOpen={setIsModalOpen}
          categoryOptions={CATEGORY_OPTIONS}
        />
      )}
    </div>
  );
};

export default Calendar;
