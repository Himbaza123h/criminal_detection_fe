import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk to handle car plate identification
export const identifyCar = createAsyncThunk(
  'identifyCar/identify',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/suspect-car-plate-detection/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to identify');
      }

      const data = await response.json();

      console.log("Response data:", data);

      return data;
    } catch (error) {
      console.error("Error in identifyCar thunk:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Create slice
const identifyCarSlice = createSlice({
  name: 'identifyCar',
  initialState: {
    result: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(identifyCar.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(identifyCar.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.result = action.payload;
      })
      .addCase(identifyCar.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default identifyCarSlice.reducer;
