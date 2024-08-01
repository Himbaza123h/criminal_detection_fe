import React, { useState } from 'react';

const StatusModal = ({ showModal, setShowModal, currentStatus, updateStatus }) => {
  const [newStatus, setNewStatus] = useState(currentStatus);

  const handleSubmit = () => {
    updateStatus(newStatus);
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 w-1/2 max-w-lg h-1/3 max-h-md rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Change Status</h2>
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="p-2 border border-gray-300 rounded mb-4 w-full">
          <option value="Wanted">Wanted</option>
          <option value="Free">Free</option>
        </select>
        <div className="flex justify-end">
          <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded mr-2">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
  
};

export default StatusModal;
