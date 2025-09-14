import express from 'express';
import {  incomeState, ordersChart } from '../controllers/chartsController.mjs';

const chartRouter = express.Router();
chartRouter.get('/orders/metrics/:startDate/:endDate',incomeState );
chartRouter.get('/orders/chart/:startDate/:endDate',ordersChart );

export default chartRouter;