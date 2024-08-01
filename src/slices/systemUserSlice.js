// src/slices/systemUserSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchSystemUsers = createAsyncThunk(
  'systemUsers/fetchSystemUsers',
  async (page = 1, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/system-users/?page=${page}`, {
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

export const addSystemUser = createAsyncThunk(
  'systemUsers/addSystemUser',
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/system-users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
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

export const deleteSystemUser = createAsyncThunk(
  'systemUsers/deleteSystemUser',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/system-users/${userId}/`, {
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

export const updateSystemUser = createAsyncThunk(
  'systemUsers/updateSystemUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/system-users/${id}/`, {
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

      const updatedUser = await response.json();
      return { id, data: updatedUser };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const systemUserSlice = createSlice({
  name: 'systemUsers',
  initialState: {
    users: [],
    status: 'idle',
    error: null,
    next: null,
    previous: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSystemUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.results;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      })
      .addCase(fetchSystemUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Error fetching users: ${action.payload}`);
      })
      .addCase(addSystemUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addSystemUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users.push(action.payload);
        toast.success('User added successfully');
      })
      .addCase(addSystemUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Error adding user: ${action.payload}`);
      })
      .addCase(deleteSystemUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteSystemUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.filter(user => user.public_id !== action.payload);
        toast.success('User deleted successfully');
      })
      .addCase(deleteSystemUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Error deleting user: ${action.payload}`);
      })
      .addCase(updateSystemUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateSystemUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.users.findIndex(user => user.public_id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload.data;
        }
        toast.success('User updated successfully');
      })
      .addCase(updateSystemUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Error updating user: ${action.payload}`);
      });
  }
});

export default systemUserSlice.reducer;
