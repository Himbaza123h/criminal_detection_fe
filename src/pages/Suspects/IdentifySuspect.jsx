import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { identifyCriminal } from '../../slices/IdentifyCriminalSlice';
import { fetchIPcameras } from '../../slices/ipCameraSlice';
import Header from '../../components/Header/index';
import Sidebar from '../../components/Sidebar/Admin/index';

const IdentifySuspect = () => {
  const dispatch = useDispatch();
  const identifyState = useSelector((state) => state.identifyCriminal);
  const ipCamerasState = useSelector((state) => state.ipCameras);
  const { status, error, result } = identifyState || {};
  const { cameras, status: cameraStatus } = ipCamerasState || {};

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detectionType, setDetectionType] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [location, setLocation] = useState('');
  const [selectedCamera, setSelectedCamera] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    if (detectionType === 'Webcam') {
      dispatch(fetchIPcameras());
    }
  }, [detectionType, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('detection_type', detectionType);

    if (image) {
      formData.append('image', image);
    } else if (video) {
      formData.append('video', video);
    } else if (detectionType === 'Webcam' && selectedCamera) {
      formData.append('webcam', selectedCamera);
    }

    formData.append('location', location);
    dispatch(identifyCriminal(formData));
  };

  useEffect(() => {
    if (status === 'succeeded') {
      setModalOpen(true);
    }
  }, [status]);

  const closeImageModal = () => {
    setModalOpen(false);
  };

  const openReportModal = () => {
    setReportModalOpen(true);
  };

  const closeReportModal = () => {
    setReportModalOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-grow p-4 md:p-6 lg:p-8">
          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-3/5">
            <h1 className="text-3xl font-bold mb-6">Identify</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Detection Type</label>
                <select
                  value={detectionType}
                  onChange={(e) => setDetectionType(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Image">Image</option>
                  <option value="Video">Video</option>
                  <option value="Webcam">Webcam</option>
                </select>
              </div>
              {detectionType === 'Image' && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
              )}
              {detectionType === 'Video' && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files[0])}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
              )}
              {detectionType === 'Webcam' && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Select IP Camera</label>
                  <select
                    value={selectedCamera}
                    onChange={(e) => setSelectedCamera(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select Camera</option>
                    {cameraStatus === 'loading' && <option>Loading cameras...</option>}
                    {cameraStatus === 'failed' && <option>Error loading cameras</option>}
                    {cameraStatus === 'succeeded' &&
                      cameras.map((camera) => (
                        <option key={camera.id} value={`${camera.url}:${camera.port}/video`}>
                          {camera.location}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {status === 'loading' ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 0114.72-5.056L14.44 12H20a8 8 0 01-16 0h4.72L4 6.944A7.998 7.998 0 014 12z"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    'Identify'
                  )}
                </button>
              </div>
              {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
            </form>
          </div>
        </main>
      </div>
      {modalOpen && result && result.annotated_image && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
            <h2 className="text-xl font-bold mb-4">Identification Results</h2>
            <div className="relative mb-4">
              <img
                src={result.annotated_image}
                alt="Annotated"
                className="w-full h-auto border-4 border-blue-500"
              />
            </div>
            <button
              className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={openReportModal}
            >
              View Report
            </button>
            <button
              className="mt-4 ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={closeImageModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {reportModalOpen && result && result.data && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
            <h2 className="text-xl font-bold mb-4">Suspect Reports</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      National Identity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crime committed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Similarity percent
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.data.map((report, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.suspect_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.suspect_crime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        
                        {report.similarity_percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={closeReportModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentifySuspect;
