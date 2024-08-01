import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { authToken } = useSelector((state) => state.user);

//   console.log("Auth Token in PrivateRoute:", authToken); // Debugging log to verify token

  if (!authToken) {
    console.log("No auth token found, redirecting to sign-in");
    // return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default PrivateRoute;
