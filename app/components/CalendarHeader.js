import React from "react";

const CalendarHeader = ({ currentDate, handlePrevMonth, handleNextMonth }) => {
  return (
    <div className="flex justify-between items-center mb-6 gap-32 md:gap-60">
        <div>
      <button
        onClick={handlePrevMonth}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Previous
      </button>
      </div>
      <div className="w-48">
      <h2 className="text-2xl font-semibold">
        {currentDate.format("MMMM YYYY")}
      </h2>
      </div>
      <div>
      <button
        onClick={handleNextMonth}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Next
      </button>
      </div>
    </div>
  );
};

export default CalendarHeader;