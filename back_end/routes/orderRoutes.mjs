import express from 'express';
import { updateQuantity,createOrder, deleteOrder, getOrderById, getOrders, updateOrder, updateState } from '../controllers/orderController.mjs';
import { verifyToken } from '../middlewares/verifyToken.mjs';

const OrderRouter = express.Router();
OrderRouter.post('/order', createOrder);
OrderRouter.get('/orders',verifyToken, getOrders);
OrderRouter.get('/order/:orderId',verifyToken, getOrderById);
OrderRouter.put('/order/:orderId',verifyToken, updateState);
OrderRouter.put('/order/quantity/:orderLineId',verifyToken, updateQuantity);
OrderRouter.delete('/order/:orderId',verifyToken,    deleteOrder);
export default OrderRouter;