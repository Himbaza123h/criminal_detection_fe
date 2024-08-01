import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarPlates, updateCarPlate, deleteCarPlate } from '../../slices/carPlateSlice';
import Header from '../../components/Header/index';
import Sidebar from '../../components/Sidebar/Admin/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewPlates = () => {
  const dispatch = useDispatch();
  const { plates = [], status, error } = useSelector((state) => state.carPlates);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [editPlate, setEditPlate] = useState(null);
  const [deletePlateId, setDeletePlateId] = useState(null);

  useEffect(() => {
    dispatch(fetchCarPlates(page));
  }, [dispatch, page, editPlate, deletePlateId]);

  const filteredDetections = plates.filter(detection => {
    const plateNumber = detection.plate_number || '';
    return plateNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = (publicId) => {
    setDeletePlateId(publicId);
  };

  const confirmDelete = () => {
    if (deletePlateId) {
      dispatch(deleteCarPlate(deletePlateId))
        .then(() => {
          toast.success('Plate deleted successfully!');
          setDeletePlateId(null);
        })
        .catch(() => {
          toast.error('Failed to delete plate.');
        });
    }
  };

  const handleUpdate = (publicId) => {
    const plate = plates.find(p => p.public_id === publicId);
    setEditPlate(plate);
  };

  const handleSaveUpdate = () => {
    if (editPlate) {
      dispatch(updateCarPlate(editPlate))
        .then(() => {
          toast.success('Plate updated successfully!');
          setEditPlate(null);
        })
        .catch(() => {
          toast.error('Failed to update plate.');
        });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-grow p-4 md:p-6 lg:p-8">
          <h1 className="text-3xl font-bold mb-6">View Plates</h1>
          <div className="flex justify-end mb-4">
            <input
              type="text"
              placeholder="Search by plate number"
              className="p-2 border border-gray-300 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Car Plates</h2>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && (
              <p className="text-red-500">
                {error || 'An error occurred while fetching data.'}
              </p>
            )}
            {filteredDetections.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">Plate Number</th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">Owner Name</th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">Car Model</th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">Committed Crime</th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">Gender</th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">Status</th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDetections.map((detection) => (
                      <tr key={detection.public_id}>
                        <td className="py-2 px-4 border-b border-gray-200">{detection.plate_number || 'N/A'}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{detection.owner_name || 'N/A'}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{detection.car_model || 'N/A'}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{detection.committed_crime || 'N/A'}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{detection.gender || 'N/A'}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{detection.status || 'N/A'}</td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          <button onClick={() => handleUpdate(detection.public_id)} className="text-blue-500">Update</button>
                          <button onClick={() => handleDelete(detection.public_id)} className="text-red-500 ml-4">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">No data available</p>
            )}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-gray-300 rounded"
                disabled={page === 1}
              >
                Previous
              </button>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 bg-gray-300 rounded"
                disabled={filteredDetections.length < 10}
              >
                Next
              </button>
            </div>
          </div>
          {editPlate && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Plate</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={editPlate.plate_number}
                    onChange={(e) => setEditPlate({ ...editPlate, plate_number: e.target.value })}
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Plate Number"
                  />
                  <input
                    type="text"
                    value={editPlate.owner_name}
                    onChange={(e) => setEditPlate({ ...editPlate, owner_name: e.target.value })}
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Owner Name"
                  />
                  <input
                    type="text"
                    value={editPlate.car_model}
                    onChange={(e) => setEditPlate({ ...editPlate, car_model: e.target.value })}
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Car Model"
                  />
                  <input
                    type="text"
                    value={editPlate.committed_crime}
                    onChange={(e) => setEditPlate({ ...editPlate, committed_crime: e.target.value })}
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Committed Crime"
                  />
                  <input
                    type="text"
                    value={editPlate.gender}
                    onChange={(e) => setEditPlate({ ...editPlate, gender: e.target.value })}
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Gender"
                  />
                  <input
                    type="text"
                    value={editPlate.status}
                    onChange={(e) => setEditPlate({ ...editPlate, status: e.target.value })}
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Status"
                  />
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleSaveUpdate}
                    className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditPlate(null)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {deletePlateId && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                <p>Are you sure you want to delete this plate?</p>
                <div className="mt-4">
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded mr-2"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setDeletePlateId(null)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ViewPlates;
