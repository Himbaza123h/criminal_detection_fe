// src/slices/ipCameraSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchIPcameras = createAsyncThunk(
  'ipCameras/fetchIPcameras',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/ip-cameras/`, {
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

export const addIPcamera = createAsyncThunk(
  'ipCameras/addIPcamera',
  async (cameraData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/ip-cameras/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cameraData)
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

export const updateIPcamera = createAsyncThunk(
  'ipCameras/updateIPcamera',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/ip-cameras/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteIPcamera = createAsyncThunk(
  'ipCameras/deleteIPcamera',
  async (cameraId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/ip-cameras/${cameraId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return cameraId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const ipCameraSlice = createSlice({
  name: 'ipCameras',
  initialState: {
    cameras: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIPcameras.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchIPcameras.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cameras = action.payload.results;
      })
      .addCase(fetchIPcameras.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Error fetching cameras: ${action.payload}`);
      })
      .addCase(addIPcamera.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addIPcamera.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cameras.push(action.payload);
        toast.success('Camera added successfully');
      })
      .addCase(addIPcamera.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Error adding camera: ${action.payload}`);
      })
      .addCase(updateIPcamera.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateIPcamera.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cameras = state.cameras.map((camera) =>
          camera.id === action.payload.id ? action.payload : camera
        );
        toast.success('Camera updated successfully');
      })
      .addCase(updateIPcamera.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Error updating camera: ${action.payload}`);
      })
      .addCase(deleteIPcamera.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteIPcamera.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cameras = state.cameras.filter((camera) => camera.id !== action.payload);
        toast.success('Camera deleted successfully');
      })
      .addCase(deleteIPcamera.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Error deleting camera: ${action.payload}`);
      });
  }
});

export default ipCameraSlice.reducer;
