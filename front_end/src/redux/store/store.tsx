import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../slices/adminSlice";
import cartReducer from "../slices/cartSlice"
import { productApi } from "@/services/products/productApi";
import { clientApi } from "@/services/clients/clientApi";
import { serviceApi } from "@/services/service/serviceApi";
import { messageApi } from "@/services/messages/messageApi";
import { orderApi } from "@/services/orders/orderApi";
const store = configureStore({
  reducer: {
    admin: adminReducer,
    cart:cartReducer,
    [productApi.reducerPath]: productApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [orderApi.reducerPath]:orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware,
      clientApi.middleware,
      serviceApi.middleware,
      messageApi.middleware,
      orderApi.middleware
    ),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
