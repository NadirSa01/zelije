import express from 'express';
import { createService, deleteService, getServiceById, getServices, updateService } from '../controllers/serviceController.mjs';
import { verifyToken } from '../middlewares/verifyToken.mjs';

const ServiceRouter = express.Router();

ServiceRouter.post('/service', createService);
ServiceRouter.get('/service', getServices);
ServiceRouter.get('/service/:serviceId', verifyToken, getServiceById);
ServiceRouter.put('/service/:serviceId', verifyToken, updateService);
ServiceRouter.delete('/service/:serviceId', verifyToken, deleteService);

export default ServiceRouter;
