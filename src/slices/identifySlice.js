// src/slices/identifySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const identify = createAsyncThunk(
  'identify/identify',
  async (identificationData) => {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/api/v1/identify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(identificationData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  }
);

const identifySlice = createSlice({
  name: 'identify',
  initialState: {
    result: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(identify.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(identify.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.result = action.payload;
      })
      .addCase(identify.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default identifySlice.reducer;
