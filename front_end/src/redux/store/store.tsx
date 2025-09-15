import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../slices/adminSlice";
import cartReducer from "../slices/cartSlice";
import serviceReducer from "../slices/serviceSlice"
import { productApi } from "@/services/products/productApi";
import { clientApi } from "@/services/clients/clientApi";
import { serviceApi } from "@/services/service/serviceApi";
import { messageApi } from "@/services/messages/messageApi";
import { orderApi } from "@/services/orders/orderApi";
import { serviceOrderApi } from "@/services/serviceOrders/serviceOrder";
import { chartApi } from "@/services/charts/chartsApi";
import { authApi } from "@/services/auth/authApi";
const store = configureStore({
  reducer: {
    admin: adminReducer,
    cart:cartReducer,
    service:serviceReducer,
    [productApi.reducerPath]: productApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [orderApi.reducerPath]:orderApi.reducer,
    [serviceOrderApi.reducerPath]:serviceOrderApi.reducer,
    [chartApi.reducerPath]:chartApi.reducer,
    [authApi.reducerPath]:authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware,
      clientApi.middleware,
      serviceApi.middleware,
      messageApi.middleware,
      orderApi.middleware,
      serviceOrderApi.middleware,
      chartApi.middleware,
      authApi.middleware,
    ),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
