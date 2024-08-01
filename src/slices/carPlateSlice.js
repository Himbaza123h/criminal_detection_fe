import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Thunk to fetch car plates
export const fetchCarPlates = createAsyncThunk(
  'carPlates/fetchCarPlates',
  async (page = 1) => {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/api/v1/suspect-car-plate/?page=${page}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data); // Log the data to check the response structure
    return data.data.suspect_car_plates; // Ensure this matches the actual response
  }
);

// Thunk to add a new car plate
export const addNewPlate = createAsyncThunk(
  'carPlates/addNewPlate',
  async (newPlate) => {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/api/v1/suspect-car-plate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newPlate),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data; // Ensure this matches the structure of the newly added plate
  }
);

// Thunk to update a car plate
export const updateCarPlate = createAsyncThunk(
  'carPlates/updatePlate',
  async ({ id, updatedPlate }) => {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/api/v1/suspect-car-plate/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedPlate),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data; // Ensure this matches the structure of the updated plate
  }
);

// Thunk to delete a car plate
export const deleteCarPlate = createAsyncThunk(
  'carPlates/deletePlate',
  async (id) => {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/api/v1/suspect-car-plate/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return id; // Return the ID of the deleted plate
  }
);

const carPlateSlice = createSlice({
  name: 'carPlates',
  initialState: {
    plates: [],
    status: 'idle',
    error: null,
    addPlateStatus: 'idle',
    addPlateError: null,
    updatePlateStatus: 'idle',
    updatePlateError: null,
    deletePlateStatus: 'idle',
    deletePlateError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch car plates cases
      .addCase(fetchCarPlates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCarPlates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.plates = action.payload;
      })
      .addCase(fetchCarPlates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Add new plate cases
      .addCase(addNewPlate.pending, (state) => {
        state.addPlateStatus = 'loading';
      })
      .addCase(addNewPlate.fulfilled, (state, action) => {
        state.addPlateStatus = 'succeeded';
        state.plates.push(action.payload); // Optionally add the new plate to the list
      })
      .addCase(addNewPlate.rejected, (state, action) => {
        state.addPlateStatus = 'failed';
        state.addPlateError = action.error.message;
      })

      // Update plate cases
      .addCase(updateCarPlate.pending, (state) => {
        state.updatePlateStatus = 'loading';
      })
      .addCase(updateCarPlate.fulfilled, (state, action) => {
        state.updatePlateStatus = 'succeeded';
        const index = state.plates.findIndex(plate => plate.id === action.payload.id);
        if (index !== -1) {
          state.plates[index] = action.payload; // Update the plate in the list
        }
      })
      .addCase(updateCarPlate.rejected, (state, action) => {
        state.updatePlateStatus = 'failed';
        state.updatePlateError = action.error.message;
      })

      // Delete plate cases
      .addCase(deleteCarPlate.pending, (state) => {
        state.deletePlateStatus = 'loading';
      })
      .addCase(deleteCarPlate.fulfilled, (state, action) => {
        state.deletePlateStatus = 'succeeded';
        state.plates = state.plates.filter(plate => plate.id !== action.payload); // Remove the deleted plate
      })
      .addCase(deleteCarPlate.rejected, (state, action) => {
        state.deletePlateStatus = 'failed';
        state.deletePlateError = action.error.message;
      });
  },
});

export default carPlateSlice.reducer;
