import express from 'express';
import { createServiceOrder, deleteServiceOrder, getServiceOrderById, getServiceOrders, updateServiceOrderPrice, updateServiceOrderState } from '../controllers/serviceOrderController.mjs';
import { verifyToken } from '../middlewares/verifyToken.mjs';

const ServiceOrderRouter = express.Router();

ServiceOrderRouter.post('/service-order', createServiceOrder);
ServiceOrderRouter.get('/service-order', verifyToken, getServiceOrders);
ServiceOrderRouter.get('/service-order/:orderId', verifyToken, getServiceOrderById);
ServiceOrderRouter.put('/service-order/:orderId', verifyToken, updateServiceOrderPrice);
ServiceOrderRouter.put('/service-order/s/:orderId', verifyToken, updateServiceOrderState);
ServiceOrderRouter.delete('/service-order/:orderId', verifyToken, deleteServiceOrder);

export default ServiceOrderRouter;
