"use client"
import React from "react";

const EventModal = ({ 
  modalData, 
  setModalData, 
  handleAddEvent, 
  handleEditEvent, 
  isEditing, 
  setIsModalOpen,
  categoryOptions
}) => {
  const colorOptions = [
    { value: "#ff0000", label: "Red" },
    { value: "#00ff00", label: "Green" },
    { value: "#0000ff", label: "Blue" },
    { value: "#ffff00", label: "Yellow" },
    { value: "#ff00ff", label: "Purple" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      const selectedCategory = categoryOptions.find(cat => cat.value === value);
      setModalData((prev) => ({ 
        ...prev, 
        [name]: value,
        color: selectedCategory ? selectedCategory.color : prev.color 
      }));
    } else {
      setModalData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (isEditing) {
      handleEditEvent();
    } else {
      handleAddEvent();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Event" : "Add Event"}</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Event Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={modalData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Event Name"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={modalData.startTime}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={modalData.endTime}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={modalData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Optional description"
              rows="3"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Event Category
            </label>
            <select
              id="category"
              name="category"
              value={modalData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              {categoryOptions.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Color
            </label>
            <div className="flex space-x-2">
              <div className="space-x-1"><span>Personal:</span> <span className="p-1 px-[15px] bg-[#00ff00] rounded-full"></span></div>
              <div className="space-x-1"><span>Work:</span> <span className="p-1 px-[15px] bg-blue-500 rounded-full"></span></div>
              <div className="space-x-1"><span>Other:</span> <span className="p-1 px-[15px] bg-purple-500 rounded-full"></span></div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSubmit}
              className="flex-grow bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {isEditing ? "Save Changes" : "Add Event"}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-grow bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
