import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaUser, FaUsers, FaPlus, FaCar, FaCamera, FaHome } from 'react-icons/fa';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 flex-shrink-0 w-64 overflow-y-auto bg-white dark:bg-gray-800 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
      style={{
        scrollbarWidth: 'thin', // Firefox
        scrollbarColor: '#888 #f1f1f1', // Firefox
      }}
    >
      <style>
        {`
          ::-webkit-scrollbar {
            width: 2px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #555;
          }

          .sidebar-header {
            position: sticky;
            top: 0;
            z-index: 10;
            background-color: inherit;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .sidebar-link {
            display: flex;
            align-items: center;
            padding: 0.75rem 1rem;
            margin-bottom: 0.5rem;
            border-radius: 0.375rem;
            transition: background-color 0.3s ease-in-out;
          }

          .sidebar-link:hover, .sidebar-link:focus {
            background-color: #e2e8f0;
          }

          .sidebar-link-active {
            background-color: #3182ce;
            color: #ffffff;
          }

          .sidebar-icon {
            margin-right: 0.75rem;
          }
        `}
      </style>
      <div className="sidebar-header flex items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold text-primary">
          Criminal Detection
        </Link>
        <button
          aria-controls="sidebar"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden"
        >
          <svg
            className="w-6 h-6 text-black dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <nav className="px-4 py-6">
        <div className="mt-2">
          <h4 className="text-gray-700 dark:text-gray-300 mb-2 sidebar-title">Home</h4>
          <div className="ml-4">
            <Link to="/admin/dashboard" className={`sidebar-link ${isActiveRoute('/admin/dashboard') ? 'sidebar-link-active' : ''}`}>
              <FaHome className="sidebar-icon" />
              Dashboard
            </Link>
          </div>
        </div>
        <hr className="my-4 border-gray-300 dark:border-gray-700" />
        <div className="mt-2">
          <h4 className="text-gray-700 dark:text-gray-300 mb-2 sidebar-title">Suspects</h4>
          <div className="ml-4">
            <Link to="/admin/create-new-suspect" className={`sidebar-link ${isActiveRoute('/admin/create-new-suspect') ? 'sidebar-link-active' : ''}`}>
              <FaPlus className="sidebar-icon" />
              Add New
            </Link>
            <Link to="/admin/view-suspects" className={`sidebar-link ${isActiveRoute('/admin/view-suspects') ? 'sidebar-link-active' : ''}`}>
              <FaUsers className="sidebar-icon" />
              View Suspects
            </Link>
            <Link to="/admin/identify-suspect" className={`sidebar-link ${isActiveRoute('/admin/identify-suspect') ? 'sidebar-link-active' : ''}`}>
              <FaCamera className="sidebar-icon" />
              Identify
            </Link>
          </div>
        </div>
        <hr className="my-2 border-gray-300 dark:border-gray-700" />

        <div className="mt-2">
          <h4 className="text-gray-700 dark:text-gray-300 mb-2 sidebar-title">Car Plates</h4>
          <div className="ml-4">
            <Link to="/admin/create-new-plate" className={`sidebar-link ${isActiveRoute('/admin/create-new-plate') ? 'sidebar-link-active' : ''}`}>
              <FaPlus className="sidebar-icon" />
              Add New
            </Link>
            <Link to="/admin/view-plate" className={`sidebar-link ${isActiveRoute('/admin/view-plate') ? 'sidebar-link-active' : ''}`}>
              <FaCar className="sidebar-icon" />
              View Plates
            </Link>
            <Link to="/admin/identify-plate" className={`sidebar-link ${isActiveRoute('/admin/identify-plate') ? 'sidebar-link-active' : ''}`}>
              <FaCamera className="sidebar-icon" />
              Identify
            </Link>
          </div>
        </div>
        <hr className="my-2 border-gray-300 dark:border-gray-700" />
        <div className="mt-2">
          <h4 className="text-gray-700 dark:text-gray-300 mb-2 sidebar-title">IP Cameras</h4>
          <div className="ml-4">
            <Link to="/admin/ipcameras/add-new" className={`sidebar-link ${isActiveRoute('/admin/ipcameras/add-new') ? 'sidebar-link-active' : ''}`}>
              <FaPlus className="sidebar-icon" />
              Add New
            </Link>
            <Link to="/admin/ipcameras/view" className={`sidebar-link ${isActiveRoute('/admin/ipcameras/view') ? 'sidebar-link-active' : ''}`}>
              <FaCamera className="sidebar-icon" />
              View Cameras
            </Link>
          </div>
        </div>
        <hr className="my-2 border-gray-300 dark:border-gray-700" />

        <div className="mt-2">
          <h4 className="text-gray-700 dark:text-gray-300 mb-2 sidebar-title">Detected</h4>
          <div className="ml-4">
            <Link to="/admin/detectedcriminals/view" className={`sidebar-link ${isActiveRoute('/admin/detectedcriminals/view') ? 'sidebar-link-active' : ''}`}>
              <FaUsers className="sidebar-icon" />
              Criminals
            </Link>
            <Link to="/admin/detectedcars/view" className={`sidebar-link ${isActiveRoute('/admin/detectedcars/view') ? 'sidebar-link-active' : ''}`}>
              <FaCar className="sidebar-icon" />
              Cars
            </Link>
          </div>
        </div>
        <hr className="my-2 border-gray-300 dark:border-gray-700" />

        <div className="mt-2">
          <h4 className="text-gray-700 dark:text-gray-300 mb-2 sidebar-title">System Users</h4>
          <div className="ml-4">
            <Link to="/admin/systemusers/add-new" className={`sidebar-link ${isActiveRoute('/admin/systemusers/add-new') ? 'sidebar-link-active' : ''}`}>
              <FaPlus className="sidebar-icon" />
              Add New
            </Link>
            <Link to="/admin/systemusers/view" className={`sidebar-link ${isActiveRoute('/admin/systemusers/view') ? 'sidebar-link-active' : ''}`}>
              <FaUser className="sidebar-icon" />
              View Users
            </Link>
          </div>
        </div>

        <hr className="my-2 border-gray-300 dark:border-gray-700" />

        <div className="mt-2">
          <h4 className="text-gray-700 dark:text-gray-300 mb-2 sidebar-title">System Logs</h4>
          <div className="ml-4">
            <Link to="/admin/systemlogs/view" className={`sidebar-link ${isActiveRoute('/admin/systemlogs/view') ? 'sidebar-link-active' : ''}`}>
              <FaUser className="sidebar-icon" />
              View Logs
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};

export default Sidebar;
