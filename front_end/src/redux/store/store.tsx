import { configureStore } from '@reduxjs/toolkit';
import adminReducer from '../slices/adminSlice';
import { productApi } from '@/services/products/productApi';
const store = configureStore({
  reducer: {
   admin :adminReducer,
   [productApi.reducerPath]:productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;