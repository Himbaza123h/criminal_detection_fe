// src/slices/criminalDetectionSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchCriminalDetections = createAsyncThunk(
  'criminalDetections/fetchCriminalDetections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/criminals/detections/`);
      const data = await response.json();
      return data.results; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const criminalDetectionSlice = createSlice({
  name: 'criminalDetections',
  initialState: {
    detections: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCriminalDetections.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCriminalDetections.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.detections = action.payload;
      })
      .addCase(fetchCriminalDetections.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default criminalDetectionSlice.reducer;
