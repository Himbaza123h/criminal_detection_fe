import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCriminals, deleteCriminal, updateCriminal } from '../../slices/suspectSlice';
import Header from '../../components/Header/index';
import Sidebar from '../../components/Sidebar/Admin/index';
import ImagePreviewModal from './ImagePreviewModal';
import { debounce } from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewSuspects = () => {
  const dispatch = useDispatch();
  const { criminals, status, error } = useSelector((state) => state.suspectCriminal);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchCriminals(page));
  }, [dispatch, page]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const filteredCriminals = criminals.filter(criminal =>
    criminal.id_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteCriminal(deleteId)).unwrap();
      // toast.success('Criminal suspect deleted successfully!');
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error deleting criminal:', error);
      toast.error('Failed to delete criminal suspect');
    }
  };

  const handleUpdateStatus = (newStatus) => {
    if (selectedCriminal) {
      dispatch(updateCriminal({ id: selectedCriminal.id, status: newStatus }));
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-grow p-4 md:p-6 lg:p-8">
          <h1 className="text-3xl font-bold mb-6">View Suspects</h1>
          <div className="flex justify-end mb-4">
            <input
              type="text"
              placeholder="Search by ID number"
              className="p-2 border border-gray-300 rounded"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Suspect criminals</h2>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <p className="text-red-500">{error}</p>}
            {filteredCriminals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">Suspect Names</th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">ID Number</th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">Crime Committed</th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">Image</th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">Status</th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCriminals.map((criminal) => (
                      <tr key={criminal.id}>
                        <td className="py-2 px-4 border-b border-gray-200">{criminal.name}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{criminal?.id_number}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{criminal.crime_committed}</td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {criminal.image ? (
                            <img
                              src={criminal.image}
                              alt={criminal.name}
                              className="h-16 w-16 object-cover rounded-full"
                            />
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">{criminal.status}</td>
                        <td className="py-2 px-4 border-b border-gray-200 items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedCriminal(criminal);
                              setShowModal(true);
                            }}
                            className="text-blue-500 hover:underline"
                          >
                            Status
                          </button>
                          <button
                            onClick={() => handleDelete(criminal.id)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
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
                disabled={filteredCriminals.length < 10}
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
      {showModal && (
        <ImagePreviewModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedCriminal={selectedCriminal}
          updateStatus={handleUpdateStatus}
        />
      )}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this criminal suspect?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-red-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-green-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ViewSuspects;
