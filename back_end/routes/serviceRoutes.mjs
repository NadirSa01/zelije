import express from 'express';
import { createService, deleteService, getServiceById, getServices, updateService } from '../controllers/serviceController.mjs';

const ServiceRouter = express.Router();

ServiceRouter.post('/service', createService);
ServiceRouter.get('/service', getServices);
ServiceRouter.get('/service/:serviceId', getServiceById);
ServiceRouter.put('/service/:serviceId', updateService);
ServiceRouter.delete('/service/:serviceId', deleteService);

export default ServiceRouter;
