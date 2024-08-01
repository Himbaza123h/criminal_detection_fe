import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Header from '../../components/Header/index';
import Sidebar from '../../components/Sidebar/Admin/index';
import { addIPcamera } from '../../slices/ipCameraSlice';
import toast from 'react-hot-toast';

const AddCamera = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [urlAddress, setUrlAddress] = useState(''); // Corrected variable name
  const [port, setPort] = useState(''); // Corrected variable name
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cameraData = {
      url: urlAddress, // Changed key from ip_address to url
      port: parseInt(port, 10), // Parse port as integer
      location: location,
    };

    try {
      await dispatch(addIPcamera(cameraData)).unwrap();
      toast.success('Camera added successfully');
      // Reset form fields
      setUrlAddress('');
      setPort('');
      setLocation('');
    } catch (error) {
      toast.error(`Error adding camera: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-grow p-4 md:p-6 lg:p-8">
          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-3/5">
            <h1 className="text-3xl font-bold mb-6">Add IP Camera</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">URL Address</label>
                <input
                  type="text"
                  value={urlAddress}
                  onChange={(e) => setUrlAddress(e.target.value)}
                  placeholder="Enter URL address"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Port</label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="Enter port number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  min={0}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter camera location"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="flex items-center justify-between md:col-span-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddCamera;
