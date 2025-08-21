import express from 'express';
import { createServiceOrder, deleteServiceOrder, getServiceOrderById, getServiceOrders, updateServiceOrder } from '../controllers/serviceOrderController.mjs';

const ServiceOrderRouter = express.Router();

ServiceOrderRouter.post('/service-order', createServiceOrder);
ServiceOrderRouter.get('/service-order', getServiceOrders); 
ServiceOrderRouter.get('/service-order/:orderId', getServiceOrderById);
ServiceOrderRouter.put('/service-order/:orderId', updateServiceOrder);
ServiceOrderRouter.delete('/service-order/:orderId', deleteServiceOrder);

export default ServiceOrderRouter;
