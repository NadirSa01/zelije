import { createSlice } from "@reduxjs/toolkit";
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admin: null,
    isAuthenticated: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.admin = action.payload;
      state.isAuthenticated = true;
    },
     clearCredentials: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
    },
  },
});
export const { setCredentials, clearCredentials } = adminSlice.actions;
export default adminSlice.reducer;
