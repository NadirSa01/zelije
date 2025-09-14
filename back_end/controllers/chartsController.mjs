import asyncHandler from "express-async-handler";
import ServiceOrder from "../models/serviceOrderModel.mjs";
import Order from "../models/orderModel.mjs";
import OrderLine from "../models/OrderLineModel.mjs";
import mongoose from "mongoose";

export const incomeState = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.params;

  try {
    let start, end;
    if (!endDate || !startDate) {
      const today = new Date();
      start = new Date(today.setHours(0, 0, 0, 0));
      end = new Date(today.setHours(23, 59, 59, 999));
    } else {
      start = new Date(startDate);
      end = new Date(endDate);

      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({ message: "Invalid date format" });
      }
    }

    const completedOrders = await Order.find({
      createdAt: { $gte: start, $lte: end },
      state: "completed",
    }).select("_id");

    const completedOrderIds = completedOrders.map((o) => o._id);

    const orderLines = await OrderLine.find({
      orderId: { $in: completedOrderIds },
      createdAt: { $gte: start, $lte: end },
    });

    const productIncome = orderLines.reduce((sum, line) => {
      const price = parseFloat(line.price.toString());
      return sum + price * line.quantity;
    }, 0);

    const serviceOrders = await ServiceOrder.find({
      createdAt: { $gte: start, $lte: end },
      state: "completed",
    });

    const serviceIncome = serviceOrders.reduce(
      (sum, s) => sum + (s.price || 0),
      0
    );
    
    return res.json({
      dateRange: { start, end },
      productIncome,
      serviceIncome,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export const ordersChart = asyncHandler(async (req, res) => {
 try {
    const { startDate, endDate } = req.params;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Normalize today for grouping
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    // Decide grouping logic
    const isToday =
      start.getTime() === startOfToday.getTime() &&
      end.getTime() === endOfToday.getTime();

    const groupFormat = isToday
      ? { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } }
      : { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }; 

    // Aggregation
    const orders = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: groupFormat, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const services = await ServiceOrder.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: groupFormat, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    let filledOrders = [];
    let filledServices = [];

    if (isToday) {
      filledOrders = orders;
      filledServices = services;
    } else {
      
      const current = new Date(start);
      while (current <= end) {
        const label = current.toISOString().slice(0, 10); 

        const orderItem = orders.find(o => o._id === label);
        const serviceItem = services.find(s => s._id === label);

        filledOrders.push({ _id: label, count: orderItem ? orderItem.count : 0 });
        filledServices.push({ _id: label, count: serviceItem ? serviceItem.count : 0 });

        current.setDate(current.getDate() + 1); 
      }
    }

    return res.status(200).json({ orders: filledOrders, services: filledServices, isToday });
  } catch (err) {
    return res.status(400).json({ message: err.message || err });
  }

});
