import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/index';
import Sidebar from '../../components/Sidebar/Admin/index';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDetectedCriminals } from '../../slices/detectedSlice';

const ViewDetectedCriminals = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { detected, status } = useSelector((state) => state.detected);

  useEffect(() => {
    dispatch(fetchDetectedCriminals({ page: 1 })); // Fetch the first page
  }, [dispatch]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-grow p-4 md:p-6 lg:p-8">
          <h1 className="text-3xl font-bold mb-6">Detected Criminals</h1>
          {status === 'loading' ? (
            <p>Loading...</p>
          ) : detected.length === 0 ? (
            <p>No detected criminals available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {detected.map((detection) => (
                <div key={detection.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-2">{detection.criminal.name}</h2>
                  <img 
                    src={detection.detection_file} 
                    alt={detection.criminal.name} 
                    className="mb-4 w-full h-48 object-cover rounded" 
                  />
                  <p><strong>ID Number:</strong> {detection.criminal.id_number}</p>
                  <p><strong>Crime Committed:</strong> {detection.criminal.crime_committed}</p>
                  <p><strong>Status:</strong> {detection.criminal.status}</p>
                  <p><strong>Detected At:</strong> {new Date(detection.detected_at).toLocaleDateString('en-CA')}</p>
                  <p><strong>Similarity:</strong> {detection.similarity_percentage}%</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ViewDetectedCriminals;
