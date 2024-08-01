import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchCarPlatesDetections = createAsyncThunk(
  'carPlatesDetections/fetchCarPlatesDetections',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/suspect-car-plate-detection/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

    //   console.log(data.data.results);
      
      return data.data.results; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const carPlatesDetectionSlice = createSlice({
  name: 'carPlatesDetections',
  initialState: {
    detections: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarPlatesDetections.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCarPlatesDetections.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.detections = action.payload;
      })
      .addCase(fetchCarPlatesDetections.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default carPlatesDetectionSlice.reducer;
