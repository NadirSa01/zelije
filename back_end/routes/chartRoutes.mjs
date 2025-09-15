import express from 'express';
import {  incomeState, ordersChart } from '../controllers/chartsController.mjs';
import { verifyToken } from '../middlewares/verifyToken.mjs';

const chartRouter = express.Router();
chartRouter.get('/orders/metrics/:startDate/:endDate',verifyToken,incomeState );
chartRouter.get('/orders/chart/:startDate/:endDate',verifyToken,ordersChart );

export default chartRouter;