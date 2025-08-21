import express from 'express';
import { createOrder, deleteOrder, getOrderById, getOrders, updateOrder } from '../controllers/orderController.mjs';

const OrderRouter = express.Router();
OrderRouter.post('/order', createOrder);
OrderRouter.get('/orders', getOrders);
OrderRouter.get('/order/:orderId', getOrderById);
OrderRouter.put('/order/:orderId', updateOrder);
OrderRouter.delete('/order/:orderId', deleteOrder);
export default OrderRouter;