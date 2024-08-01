// src/slices/detectedSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk to fetch detected criminals data without pagination
export const fetchDetectedCriminals = createAsyncThunk(
  'detected/fetchDetectedCriminals',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/criminals/detections/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);




export const fetchDetectedCars = createAsyncThunk(
  'detected/fetchDetectedCars',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/suspect-car-plate-detection/?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();

      console.log(data);
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);




const detectedSlice = createSlice({
  name: 'detected',
  initialState: {
    detected: [],  // To store detected criminals data
    status: 'idle', // To track loading status
    error: null,    // To store any error messages
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetectedCriminals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDetectedCriminals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.detected = action.payload.results; // Storing fetched results
      })
      .addCase(fetchDetectedCriminals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Error fetching detected data: ${action.payload}`);
      })


      .addCase(fetchDetectedCars.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDetectedCars.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.detected = action.payload.results; 
      })
      .addCase(fetchDetectedCars.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Error fetching detected data: ${action.payload}`);
      });
  }
});

export default detectedSlice.reducer;
