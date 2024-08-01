import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Header from '../../components/Header/index';
import Sidebar from '../../components/Sidebar/Admin/index';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSystemUsers } from '../../slices/systemUserSlice';
import { fetchCriminalDetections } from '../../slices/criminalDetectionSlice';
import { fetchCarPlatesDetections } from '../../slices/carPlatesDetectionSlice';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { users: systemUsers } = useSelector((state) => state.systemUsers);
  const { detections: criminalDetections, status: criminalDetectionStatus } = useSelector((state) => state.criminalDetections);
  const { detections: carPlatesDetections, status: carPlatesDetectionStatus } = useSelector((state) => state.carPlatesDetections);

  useEffect(() => {
    dispatch(fetchSystemUsers());
    dispatch(fetchCriminalDetections());
    dispatch(fetchCarPlatesDetections());
  }, [dispatch]);

  // Ensure that the data is loaded before rendering the charts
  if (criminalDetectionStatus === 'loading' || carPlatesDetectionStatus === 'loading' || !criminalDetections || !carPlatesDetections) {
    return <div>Loading...</div>;
  }

  // Chart data
  const carPlateData = {
    labels: carPlatesDetections.map(d => d.suspect_car_plate),
    datasets: [
      {
        label: 'Car Plate Detections',
        data: carPlatesDetections.map(d => new Date(d.detected_at).getDate()),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const criminalData = {
    labels: criminalDetections.map(d => d.criminal.name),
    datasets: [
      {
        label: 'Criminal Detections',
        data: criminalDetections.map(d => new Date(d.detected_at).getDate()),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const doughnutData = {
    labels: ['Car Plate Detections', 'Criminal Detections'],
    datasets: [
      {
        data: [carPlatesDetections.length, criminalDetections.length],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
      },
    ],
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-grow p-4 md:p-6 lg:p-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md h-40">
              <h2 className="text-xl font-semibold mb-2">Total Car Plate Detections</h2>
              <p className="text-3xl font-bold">{carPlatesDetections.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md h-40">
              <h2 className="text-xl font-semibold mb-2">Total Criminal Detections</h2>
              <p className="text-3xl font-bold">{criminalDetections.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md h-40">
              <h2 className="text-xl font-semibold mb-2">Total System Users</h2>
              <p className="text-3xl font-bold">{systemUsers.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md h-80 flex items-center justify-center">
              <Doughnut data={doughnutData} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md h-80">
              <h2 className="text-xl font-semibold mb-4">Car Plate Detections</h2>
              <Bar data={carPlateData} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md h-80">
              <h2 className="text-xl font-semibold mb-4">Criminal Detections</h2>
              <Bar data={criminalData} height={200} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
