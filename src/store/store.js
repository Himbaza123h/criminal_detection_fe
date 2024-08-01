// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../slices/user';
import { userApi } from '../actions/users';
import carPlateSlice from '../slices/carPlateSlice';
import identifySlice from '../slices/identifySlice'; 
import systemUserSlice from '../slices/systemUserSlice';
import ipCameraSlice from '../slices/ipCameraSlice';
import criminalDetectionSlice from '../slices/criminalDetectionSlice';
import carPlatesDetectionSlice from '../slices/carPlatesDetectionSlice';
import identifyCarSlice from '../slices/identifyCarSlice'; 
import identifyCriminalSlice from '../slices/IdentifyCriminalSlice';
import suspectSlice from '../slices/suspectSlice';
import detectedSlice from '../slices/detectedSlice';
import databaseLogsSlice from '../slices/databaseLogsSlice';



export const store = configureStore({
  reducer: {
    user: userSlice,
    [userApi.reducerPath]: userApi.reducer,
    carPlates: carPlateSlice,
    identify: identifySlice, 
    systemUsers: systemUserSlice,
    ipCameras: ipCameraSlice,
    criminalDetections: criminalDetectionSlice,
    carPlatesDetections: carPlatesDetectionSlice,
    identifyCar: identifyCarSlice, 
    identifyCriminal: identifyCriminalSlice,
    suspectCriminal: suspectSlice,
    detected: detectedSlice,
    databaseLogs: databaseLogsSlice,


  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});
