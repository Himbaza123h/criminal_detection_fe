import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import { identifyCar } from '../../slices/identifyCarSlice';
import { fetchIPcameras } from '../../slices/ipCameraSlice';
import Header from '../../components/Header/index';
import Sidebar from '../../components/Sidebar/Admin/index';

const IdentifyPlate = () => {
  const dispatch = useDispatch();
  const identifyState = useSelector((state) => state.identifyCar);
  const ipCamerasState = useSelector((state) => state.ipCameras);
  const { status, error, result } = identifyState || {};
  const { cameras, status: cameraStatus } = ipCamerasState || {};
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detectionType, setDetectionType] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [location, setLocation] = useState('');
  const [selectedCamera, setSelectedCamera] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [showTitle, setShowTitle] = useState(false);

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

    dispatch(identifyCar(formData));
  };

  useEffect(() => {
    if (status === 'succeeded') {
      if (result && result.data && result.data.length > 0) {
        setShowTitle(true);
        setModalContent(
          <>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Plate Number</th>
                  <th className="px-4 py-2">Car Owner</th>
                  <th className="px-4 py-2">Committed Crime</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((item) => (
                  <tr key={item.detection_id}>
                    <td className="border px-4 py-2">{item.plate_number}</td>
                    <td className="border px-4 py-2">{item.car_owner}</td>
                    <td className="border px-4 py-2">{item.committed_crime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        );
      } else {
        setShowTitle(false);
        setModalContent(
          <p className="text-red-500 text-xs italic">Car Plate not detected</p>
        );
      }
      setModalIsOpen(true);
    } else if (status === 'failed') {
      setShowTitle(false);
      setModalContent(
        <p className="text-red-500 text-xs italic">{error || 'An error occurred'}</p>
      );
      setModalIsOpen(true);
    }
  }, [status, result, error]);

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
                    required
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
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0114.72-5.056L14.44 12H20a8 8 0 01-16 0h4.72L4 6.944A7.998 7.998 0 014 12z"></path>
                      </svg>
                    </div>
                  ) : 'Identify'}
                </button>
              </div>
              {/* {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>} */}
            </form>
          </div>
        </main>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Car Plate Identification Results"
        className="bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto mt-50 relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
      >
        {showTitle && <h3 className="text-center font-bold mb-4">Car Plate Identification Results</h3>}
        {modalContent}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setModalIsOpen(false);
              setDetectionType('');
              setImage(null);
              setVideo(null);
              setLocation('');
              setSelectedCamera('');
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default IdentifyPlate;
