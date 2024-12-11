import React from "react";
import dayjs from "dayjs";

const CalendarGrid = ({ currentDate, events, handleDayClick, selectedDay, isSearchActive }) => {
  const daysInMonth = currentDate.daysInMonth();
  const startDay = currentDate.startOf("month").day();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getCategoryBackgroundColor = (events) => {
    if (!events || events.length === 0) return "";

    const categoryPriority = ["work", "personal", "others"];
    for (let category of categoryPriority) {
      if (events.some((event) => event.category === category)) {
        return `bg-${
          category === "work"
            ? "blue"
            : category === "personal"
            ? "green"
            : "purple"
        }-200`;
      }
    }
    return "";
  };

  const today = dayjs().format("YYYY-MM-DD");

  if (isSearchActive) {
    return (
      <div className="mt-4">
        {Object.keys(events).length > 0 ? (
          Object.keys(events).map((day) => (
            <div key={day} className="border p-4 my-2 rounded-lg shadow-md bg-white">
              <div className="font-bold text-lg text-gray-700 mb-2">{day}</div>
              {events[day].map((event, index) => (
                <div
                  key={`${day}-${index}`}
                  className="text-sm truncate text-gray-600"
                  style={{ color: event.color }}
                >
                  {event.name} ({event.startTime} - {event.endTime})
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center">No events match your search.</div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-bold text-center text-gray-600">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-gray-50 rounded-lg"></div>
        ))}
        {days.map((day) => {
          const formattedDate = currentDate.date(day).format("YYYY-MM-DD");
          const dayEvents = events[formattedDate] || [];
          const bgColor = getCategoryBackgroundColor(dayEvents);

          const isToday = formattedDate === today;
          const isSelectedDay = formattedDate === selectedDay;

          return (
            <div
              key={day}
              className={`border p-4 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 ${bgColor} ${
                isToday ? "bg-violet-300 ring-2 ring-violet-500" : ""
              } ${isSelectedDay ? "ring-2 ring-indigo-500" : ""}`}
              onClick={(event) => handleDayClick(formattedDate, event)}
            >
              <div className={`font-bold text-lg ${isToday ? "text-red-500" : "text-gray-800"}`}>
                {day}
              </div>
              {dayEvents.map((event, index) => (
                <div
                  key={`${formattedDate}-${index}`}
                  className="text-sm truncate font-semibold"
                  style={{ color: event.color }}
                >
                  {event.name}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;