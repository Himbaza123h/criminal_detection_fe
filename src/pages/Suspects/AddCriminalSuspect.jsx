import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCriminal } from '../../slices/suspectSlice';
import Header from '../../components/Header/index';
import Sidebar from '../../components/Sidebar/Admin/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCriminalSuspect = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [crimeCommitted, setCrimeCommitted] = useState('');
  const [status, setStatus] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Create a FormData object
    const formData = new FormData();
    formData.append('name', name);
    formData.append('id_number', idNumber);
    formData.append('crime_committed', crimeCommitted);
    formData.append('status', status);
    if (image) {
      formData.append('image', image);
    }
  
    // Log FormData content
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File: ${value.name}]`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
  
    try {
      await dispatch(addCriminal(formData)).unwrap();
      // toast.success('Criminal added successfully!');
    } catch (error) {
      toast.error(`Error adding criminal: ${error.message}`);
    } finally {
      setLoading(false);
      // Reset form fields
      setName('');
      setIdNumber('');
      setCrimeCommitted('');
      setStatus('');
      setImage(null);
    }
  };
  
  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-grow p-4 md:p-6 lg:p-8">
          <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <h1 className="text-3xl font-bold mb-6">Add Criminal Suspect</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6" encType="multipart/form-data">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter suspect's name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">ID Number</label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="Enter suspect's ID number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required maxLength={16}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Crime Committed</label>
                <input
                  type="text"
                  value={crimeCommitted}
                  onChange={(e) => setCrimeCommitted(e.target.value)}
                  placeholder="Enter committed crime"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Wanted">Wanted</option>
                  <option value="Free">Free</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Selected"
                    className="mt-4 w-32 h-32 object-cover border border-gray-300 rounded"
                  />
                )}
              </div>
              <div className="flex items-center justify-between md:col-span-3">
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
          <ToastContainer />
        </main>
      </div>
    </div>
  );
};

export default AddCriminalSuspect;
