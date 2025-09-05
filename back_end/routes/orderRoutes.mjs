import express from 'express';
import { updateQuantity,createOrder, deleteOrder, getOrderById, getOrders, updateOrder, updateState } from '../controllers/orderController.mjs';

const OrderRouter = express.Router();
OrderRouter.post('/order', createOrder);
OrderRouter.get('/orders', getOrders);
OrderRouter.get('/order/:orderId', getOrderById);
OrderRouter.put('/order/:orderId', updateState);
OrderRouter.put('/order/quantity/:orderLineId', updateQuantity);
OrderRouter.delete('/order/:orderId', deleteOrder);
export default OrderRouter;