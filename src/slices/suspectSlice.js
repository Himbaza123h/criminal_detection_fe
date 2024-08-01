// src/slices/suspectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchCriminals = createAsyncThunk(
  'criminals/fetchCriminals',
  async (page = 1, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/criminals/?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCriminal = createAsyncThunk(
    'criminals/addCriminal',
    async (formData, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/v1/criminals/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // Do not set 'Content-Type' header here
          },
          body: formData
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
  

export const deleteCriminal = createAsyncThunk(
  'criminals/deleteCriminal',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/criminals/${userId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCriminal = createAsyncThunk(
  'criminals/updateCriminal',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/criminals/${id}/`, {
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

      const updatedCriminal = await response.json();
      return { id, data: updatedCriminal };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const criminalSlice = createSlice({
  name: 'criminals',
  initialState: {
    criminals: [],
    status: 'idle',
    error: null,
    next: null,
    previous: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCriminals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCriminals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.criminals = action.payload.results;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      })
      .addCase(fetchCriminals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Error fetching criminals: ${action.payload}`);
      })
      .addCase(addCriminal.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCriminal.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.criminals.push(action.payload);
        toast.success('Criminal added successfully');
      })
      .addCase(addCriminal.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Error adding criminal: ${action.payload}`);
      })
      .addCase(deleteCriminal.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCriminal.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.criminals = state.criminals.filter(criminal => criminal.id !== action.payload);
        toast.success('Criminal deleted successfully');
      })
      .addCase(deleteCriminal.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Error deleting criminal: ${action.payload}`);
      })
      .addCase(updateCriminal.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCriminal.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.criminals.findIndex(criminal => criminal.id === action.payload.id);
        if (index !== -1) {
          state.criminals[index] = action.payload.data;
        }
        toast.success('Criminal updated successfully');
      })
      .addCase(updateCriminal.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Error updating criminal: ${action.payload}`);
      });
  }
});

export default criminalSlice.reducer;
