import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header/index';
import Sidebar from '../../components/Sidebar/Admin/index';
import { fetchIPcameras, deleteIPcamera, updateIPcamera } from '../../slices/ipCameraSlice';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

const ViewIPcameras = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [editCameraData, setEditCameraData] = useState({ url: '', port: '', location: '' });
  const [message, setMessage] = useState({ type: '', text: '' }); // Message state
  const dispatch = useDispatch();
  const { cameras, status, error } = useSelector((state) => state.ipCameras);

  useEffect(() => {
    dispatch(fetchIPcameras());
  }, [dispatch]);

  const filteredCameras = Array.isArray(cameras) ? cameras.filter((camera) => {
    const ipAddress = camera?.ip_address || '';
    const location = camera?.location || '';
    return ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
           location.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  const openModal = (camera) => {
    setSelectedCamera(camera);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedCamera(null);
    setModalIsOpen(false);
  };

  const openEditModal = (camera) => {
    setSelectedCamera(camera);
    setEditCameraData({ url: camera.url || '', port: camera.port || '', location: camera.location || '' });
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setSelectedCamera(null);
    setEditModalIsOpen(false);
  };

  const handleDelete = async () => {
    if (selectedCamera) {
      try {
        await dispatch(deleteIPcamera(selectedCamera.id)).unwrap();
        closeModal();
        setMessage({ type: 'success', text: 'Camera deleted successfully' });
        dispatch(fetchIPcameras());
      } catch (err) {
        setMessage({ type: 'error', text: 'Error deleting camera' });
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (selectedCamera) {
      try {
        await dispatch(updateIPcamera({ id: selectedCamera.id, data: editCameraData })).unwrap();
        closeEditModal();
        setMessage({ type: 'success', text: 'Camera updated successfully' });
        dispatch(fetchIPcameras());
      } catch (err) {
        setMessage({ type: 'error', text: 'Error updating camera' });
      }
    }
  };

  const handleEditChange = (e) => {
    setEditCameraData({ ...editCameraData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (status === 'succeeded') {
      console.log('Fetched Cameras:', cameras);
    }
    if (status === 'failed') {
      console.error('Error fetching cameras:', error);
      setMessage({ type: 'error', text: `Error fetching cameras: ${error}` });
    }
  }, [status, cameras, error]);

  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-col flex-1 overflow-y-auto">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-grow p-4 md:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">View IP Cameras</h1>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <p>Error: {error}</p>}
            {status === 'succeeded' && filteredCameras.length === 0 && <p>No cameras found</p>}
            {status === 'succeeded' && filteredCameras.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">N/O</th>
                        <th className="px-4 py-2">IP Address</th>
                        <th className="px-4 py-2">Location</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCameras.map((camera, index) => (
                        <tr key={camera.id}>
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2">{camera.url}:{camera.port}</td>
                          <td className="border px-4 py-2">{camera.location}</td>
                          <td className="border px-4 py-2">
                            <button
                              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                              onClick={() => openEditModal(camera)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                              onClick={() => openModal(camera)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {/* Display messages */}
            {message.text && (
              <div className={`mt-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message.text}
              </div>
            )}
          </main>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Confirm Delete"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this camera?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDelete}
                className="bg-green-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeModal}
                className="bg-red-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={editModalIsOpen}
          onRequestClose={closeEditModal}
          contentLabel="Edit Camera"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white p-6 rounded-lg w-full md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Camera</h2>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">URL</label>
                <input
                  type="text"
                  name="url"
                  value={editCameraData.url}
                  onChange={handleEditChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Port</label>
                <input
                  type="text"
                  name="port"
                  value={editCameraData.port}
                  onChange={handleEditChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editCameraData.location}
                  onChange={handleEditChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex justify-end mt-4 md:col-span-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-red-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default ViewIPcameras;
