
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Loader from './common/Loader';
import { useEffect, useState } from "react";
import SignIn from "./pages/Auth/SignIn";
import Index from "./pages/Landing/Index";
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import PoliceDashboard from './pages/Dashboard/PoliceDashboard';
import CheckerDashboard from './pages/Dashboard/CheckerDashboard';
import ViewPlates from './pages/CarPlates/ViewPlates'
import AddNewPlate from "./pages/CarPlates/AddNewPlate";
import IdentifyPlate from "./pages/CarPlates/IdentifyPlate";
import AddCriminalSuspect from "./pages/Suspects/AddCriminalSuspect";
import ViewSuspects from "./pages/Suspects/ViewSuspects";
import IdentifySuspect from "./pages/Suspects/IdentifySuspect";
import AddCamera from "./pages/Cameras/AddCamera";
import ViewCameras from "./pages/Cameras/ViewCameras";
import AddSystemUser from "./pages/Users/AddSystemUser";
import ViewSystemUsers from "./pages/Users/ViewSystemUsers";
import ViewDetectedCriminals from "./pages/Detected/ViewDetectedCriminals";
import ViewDetectedCars from "./pages/Detected/ViewDetectedCars";
import ViewSystemLogs from "./pages/Logs/ViewSystemLogs";



function App() {
    return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="view-plate" element={<ViewPlates />} />
                <Route path="create-new-plate" element={<AddNewPlate />} />
                <Route path="identify-plate" element={<IdentifyPlate />} />
                <Route path="create-new-suspect" element={<AddCriminalSuspect />} />
                <Route path="view-suspects" element={<ViewSuspects />} />
                <Route path="identify-suspect" element={<IdentifySuspect />} />
                <Route path="ipcameras/add-new" element={<AddCamera />} />
                <Route path="ipcameras/view" element={<ViewCameras />} />
                <Route path="systemusers/add-new" element={<AddSystemUser />} />
                <Route path="systemusers/view" element={<ViewSystemUsers />} />
                <Route path="detectedcriminals/view" element={<ViewDetectedCriminals />} />
                <Route path="detectedcars/view" element={<ViewDetectedCars />} />
                <Route path="systemlogs/view" element={<ViewSystemLogs />} />
              </Routes>
            </PrivateRoute>
          }
        />
        <Route
          path="/police/*"
          element={
            <PrivateRoute>
              <Routes>
                <Route path="dashboard" element={<PoliceDashboard />} />
                <Route path="detectedcriminals/view" element={<ViewDetectedCriminals />} />
                <Route path="detectedcars/view" element={<ViewDetectedCars />} />
                <Route path="ipcameras/view" element={<ViewCameras />} />
                <Route path="view-plate" element={<ViewPlates />} />
                <Route path="identify-plate" element={<IdentifyPlate />} />
                <Route path="view-suspects" element={<ViewSuspects />} />
                <Route path="identify-suspect" element={<IdentifySuspect />} />
              </Routes>
            </PrivateRoute>
          } 
        />
          <Route
          path="/checker/*"
          element={
            <PrivateRoute>
              <Routes>

                <Route path="dashboard" element={<CheckerDashboard />} />
                </Routes>
                </PrivateRoute>
                }
                />
      </Routes>
    );
  }
  
  export default App;