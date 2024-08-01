// ImagePreviewModal.jsx
import React, { useState } from 'react';

const ImagePreviewModal = ({ showModal, setShowModal, selectedCriminal, updateStatus }) => {
  const [newStatus, setNewStatus] = useState(selectedCriminal?.status || '');

  const handleSubmit = () => {
    if (selectedCriminal) {
      updateStatus(newStatus);
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Modify Criminal Status</h2>
        {selectedCriminal?.image && (
          <div className="mb-4 text-center">
            <img
              src={selectedCriminal.image}
              alt={selectedCriminal.name}
              className="h-32 w-32 object-cover rounded-full mx-auto"
            />
            <p className="mt-2 text-sm text-gray-600">{selectedCriminal.name}</p>
          </div>
        )}
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-4 w-full"
        >
          <option value="Wanted">Wanted</option>
          <option value="Free">Free</option>
        </select>
        <div className="flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-300 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
