import type { IService } from "@/types/service";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
const ServiceCart = createSlice({
  name: "service",
  initialState: {
    service: JSON.parse(localStorage?.getItem("service") || "[]"),
  },
  reducers: {
    addService: (state, action: PayloadAction<IService>) => {
      localStorage.setItem("service", "");
      state.service = "";
      if (action.payload) {
        state.service = action.payload;
        localStorage.setItem("service", JSON.stringify(state.service));
      }
    },
    removeService: (state) => {
      localStorage.setItem("service", "");
      state.service = "";
    },
  },
});
export const { addService, removeService } = ServiceCart.actions;
export default ServiceCart.reducer;
