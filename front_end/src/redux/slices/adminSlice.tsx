import { createSlice } from "@reduxjs/toolkit";
const adminSlice = createSlice({
    name : "admin",
    initialState:{
        admin: null,
        token: null

    },
    reducers:{}
})
export default adminSlice.reducer;