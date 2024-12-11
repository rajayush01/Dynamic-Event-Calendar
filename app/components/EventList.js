"use client"
import React from "react";

const EventList = ({ 
  selectedDay, 
  events, 
  handleDeleteEvent, 
  setModalData 
}) => (
  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
    <h3 className="text-lg font-bold mb-3">Events for {selectedDay}</h3>
    {events.length === 0 ? (
      <p className="text-gray-500">No events for this day.</p>
    ) : (
      <div className="space-y-3">
        {events.map((event) => (
          <div 
            key={`${selectedDay}-${event.id || event.name}`}
            className="flex items-center p-3 bg-white rounded-lg shadow-sm border"
            style={{ borderLeftColor: event.color, borderLeftWidth: '4px' }}
          >
            <div className="flex-grow">
              <div className="font-bold text-gray-800">{event.name}</div>
              <div className="text-sm text-gray-600">
                {event.startTime} - {event.endTime}
              </div>
              {event.description && (
                <div className="text-sm text-gray-500 mt-1">
                  {event.description}
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setModalData(event)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteEvent(selectedDay, event.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default EventList;
