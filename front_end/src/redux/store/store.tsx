import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../slices/adminSlice";
import { productApi } from "@/services/products/productApi";
import { clientApi } from "@/services/clients/clientApi";
import { serviceApi } from "@/services/service/serviceApi";
import { messageApi } from "@/services/messages/messageApi";
const store = configureStore({
  reducer: {
    admin: adminReducer,
    [productApi.reducerPath]: productApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware,
      clientApi.middleware,
      serviceApi.middleware,
      messageApi.middleware
    ),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
