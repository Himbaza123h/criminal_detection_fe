// src/slices/databaseLogsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const fetchDatabaseLogs = createAsyncThunk(
  'databaseLogs/fetchDatabaseLogs',
  async ({ page = 1, limit = 9 }) => {
    const response = await fetch(`${API_BASE_URL}/databaselogs/database-logs/`, {
      params: { page, limit }
    });

    if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
    return data;
    
  }
);

const databaseLogsSlice = createSlice({
  name: 'databaseLogs',
  initialState: {
    logs: [],
    status: 'idle',
    error: null,
    currentPage: 1,
    totalPages: 1
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatabaseLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatabaseLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.logs = action.payload.logs;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchDatabaseLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default databaseLogsSlice.reducer;
