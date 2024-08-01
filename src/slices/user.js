import { createSlice } from '@reduxjs/toolkit';
import { decodeToken } from 'react-jwt';

const initialState = {
  user: localStorage.getItem("authToken") ? decodeToken(localStorage.getItem("authToken")) : null,
  authToken: localStorage.getItem("authToken") || null,
  loading: false,
};


// console.log(initialState);


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.authToken = action.payload.access;
      state.user = decodeToken(action.payload.access);
      localStorage.setItem("authToken", action.payload.access);
    },
    logoutUser: (state) => {
      state.authToken = null;
      state.user = null;
      localStorage.removeItem("authToken");
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { loginUser, logoutUser, setUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
