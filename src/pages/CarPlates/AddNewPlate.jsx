// src/pages/CarPlates/AddNewPlate.jsx
import React, { useState } from 'react';
import Header from '../../components/Header/index';
import Sidebar from '../../components/Sidebar/Admin/index';
import { useDispatch, useSelector } from 'react-redux';
import { addNewPlate } from '../../slices/carPlateSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const STATUS_CHOICES = [
  { value: 'Wanted', label: 'Wanted' },
  { value: 'Free', label: 'Free' },
];

const AddNewPlate = () => {
  const dispatch = useDispatch();
  const { addPlateStatus, addPlateError } = useSelector((state) => state.carPlates);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [plateNumber, setPlateNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [carModel, setCarModel] = useState('');
  const [committedCrime, setCommittedCrime] = useState('');
  const [gender, setGender] = useState('');
  const [plateStatus, setPlateStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPlate = {
      plate_number: plateNumber,
      owner_name: ownerName,
      car_model: carModel,
      committed_crime: committedCrime,
      gender,
      status: plateStatus,
    };

    console.log('Submitting new plate:', newPlate);

    try {
      const response = await dispatch(addNewPlate(newPlate)).unwrap();
      console.log('Response from server:', response);
      toast.success('Car plate added successfully!');
      // Reset form fields
      setPlateNumber('');
      setOwnerName('');
      setCarModel('');
      setCommittedCrime('');
      setGender('');
      setPlateStatus('');
    } catch (error) {
      console.error('Error adding new plate:', error);
      toast.error('Failed to add car plate');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-grow p-4 md:p-6 lg:p-8">
          <h1 className="text-3xl font-bold mb-6">Add New Plate</h1>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Plate Number</label>
              <input
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                placeholder="Enter plate number"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Owner Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                placeholder="Enter owner name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Car Model</label>
              <input
                type="text"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                placeholder="Enter car model"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Committed Crime</label>
              <input
                type="text"
                value={committedCrime}
                onChange={(e) => setCommittedCrime(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                placeholder="Enter committed crime"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
              <select
                value={plateStatus}
                onChange={(e) => setPlateStatus(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select Status</option>
                {STATUS_CHOICES.map((choice) => (
                  <option key={choice.value} value={choice.value}>
                    {choice.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-full flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={addPlateStatus === 'loading'}
              >
                {addPlateStatus === 'loading' ? 'Submitting...' : 'Submit'}
              </button>
            </div>
            {addPlateError && <p className="col-span-full text-red-500 text-xs italic mt-4">{addPlateError}</p>}
          </form>
          <ToastContainer />
        </main>
      </div>
    </div>
  );
};

export default AddNewPlate;
