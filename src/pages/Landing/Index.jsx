import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-4xl p-12 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-white text-center">
        <h2 className="text-3xl font-bold mb-8 text-primary">
          Welcome to the Criminal Detection System
        </h2>
        <p className="text-xl mb-10">
          This system provides secure access to criminal detection and car plate number recognition services.
        </p>
        <div className="space-x-6">
          <Link to="/sign-in" className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition duration-200">
            Sign In
          </Link>
          <Link to="/about-us" className="inline-block px-8 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition duration-200">
            About Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
