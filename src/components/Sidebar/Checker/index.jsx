import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaUser, FaUsers, FaPlus, FaCar, FaCamera, FaHome } from 'react-icons/fa';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
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
          <h4 className="text-gray-700 dark:text-gray-300 mb-2 sidebar-title">Suspects</h4>
          <div className="ml-4">
            <Link to="" className="sidebar-link">
              <FaCamera className="sidebar-icon" />
              Identify
            </Link>
          </div>
        </div>
        <hr className="my-2 border-gray-300 dark:border-gray-700" />

        <div className="mt-2">
          <h4 className="text-gray-700 dark:text-gray-300 mb-2 sidebar-title">Car Plates</h4>
          <div className="ml-4">
            <Link to="" className="sidebar-link">
              <FaCamera className="sidebar-icon" />
              Identify
            </Link>
          </div>
        </div>
        <hr className="my-2 border-gray-300 dark:border-gray-700" />

        <div className="mt-2">
          <h4 className="text-gray-700 dark:text-gray-300 mb-2 sidebar-title">Detected</h4>
          <div className="ml-4">
            <Link to="/systemusers/add-new" className="sidebar-link">
              <FaUsers className="sidebar-icon" />
              Criminals
            </Link>
            <Link to="/systemusers/view" className="sidebar-link">
              <FaCar className="sidebar-icon" />
              Cars
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
