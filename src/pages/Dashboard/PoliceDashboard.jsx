import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Header from '../../components/Header/index'; 
import Sidebar from '../../components/Sidebar/Police/index'; 

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PoliceDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [carPlateDetections, setCarPlateDetections] = useState([]);
  const [criminalDetections, setCriminalDetections] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);

  useEffect(() => {
    // Mock data for car plate detections
    const mockCarPlateDetections = [
      { id: 1, result: 'ABC123', detected_at: '2024-08-01T12:00:00Z' },
      { id: 2, result: 'XYZ789', detected_at: '2024-08-02T14:30:00Z' },
      { id: 3, result: 'LMN456', detected_at: '2024-08-03T16:45:00Z' },
    ];

    // Mock data for criminal detections
    const mockCriminalDetections = [
      { id: 1, result: 'John Doe', detected_at: '2024-08-01T12:00:00Z' },
      { id: 2, result: 'Jane Smith', detected_at: '2024-08-02T14:30:00Z' },
      { id: 3, result: 'Bob Johnson', detected_at: '2024-08-03T16:45:00Z' },
    ];

    // Mock data for system users
    const mockSystemUsers = [
      { id: 1, name: 'Admin' },
      { id: 2, name: 'User1' },
      { id: 3, name: 'User2' },
    ];

    // Simulate data fetching
    setTimeout(() => {
      setCarPlateDetections(mockCarPlateDetections);
      setCriminalDetections(mockCriminalDetections);
      setSystemUsers(mockSystemUsers);
    }, 1000); // Simulating a delay for fetching data
  }, []);

  // Chart data
  const carPlateData = {
    labels: carPlateDetections.map(d => d.result),
    datasets: [
      {
        label: 'Car Plate Detections',
        data: carPlateDetections.map(d => new Date(d.detected_at).getDate()),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const criminalData = {
    labels: criminalDetections.map(d => d.result),
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
        data: [carPlateDetections.length, criminalDetections.length],
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
          <h1 className="text-3xl font-bold mb-6">Police Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md h-40">
              <h2 className="text-xl font-semibold mb-2">Total Car Plate Detections</h2>
              <p className="text-3xl font-bold">{carPlateDetections.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md h-40">
              <h2 className="text-xl font-semibold mb-2">Total Criminal Detections</h2>
              <p className="text-3xl font-bold">{criminalDetections.length}</p>
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

export default PoliceDashboard;
