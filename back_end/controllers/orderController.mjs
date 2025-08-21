import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/orderModel.mjs";
import OrderLine from "../models/OrderLineModel.mjs";
// ---------------------------
// Create order + lines
// ---------------------------
export const createOrder = asyncHandler(async (req, res) => {
  const { clientId, address, installationRequired, installationCost, cart } = req.body;

  try {
    // Step 1: create the order
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + (installationRequired ? installationCost : 0);

    const order = await Order.create({
      clientId,
      address,
      state: "pending",
      price: totalPrice,
      installationRequired: installationRequired || false,
      installationCost: installationCost || 0,
    });

    // Step 2: create all order lines
    const orderLines = await Promise.all(
      cart.map((item) =>
        OrderLine.create({
          orderId: order._id,
          productId: item.productId,
          productDetailId: item.productDetailId,
          quantity: item.quantity,
          price: item.price,
        })
      )
    );

    return res.status(201).json({
      message: "Order created successfully",
      order,
      orderLines,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating order", error });
  }
});

// ---------------------------
// Get all orders with lines
// ---------------------------
export const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    // populate lines manually
    const orderIds = orders.map(o => o._id);
    const lines = await OrderLine.find({ orderId: { $in: orderIds } }).lean();

    const ordersWithLines = orders.map(order => ({
      ...order,
      orderLines: lines.filter(line => line.orderId.toString() === order._id.toString())
    }));

    return res.status(200).json({ total: orders.length, orders: ordersWithLines });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching orders", error });
  }
});

// ---------------------------
// Get single order by ID
// ---------------------------
export const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });

    const lines = await OrderLine.find({ orderId }).lean();

    return res.status(200).json({ ...order, orderLines: lines });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching order", error });
  }
});

// ---------------------------
// Update order and replace lines
// ---------------------------
export const updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { clientId, state, price, installationRequired, installationCost, orderLines } = req.body;

  try {
    // Step 1: find the order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Step 2: update order fields
    order.clientId = clientId || order.clientId;
    order.state = state || order.state;
    order.price = price ?? order.price;
    order.installationRequired = installationRequired ?? order.installationRequired;
    order.installationCost = installationCost ?? order.installationCost;

    await order.save();

    // Step 3: replace order lines
    await OrderLine.deleteMany({ orderId });

    if (Array.isArray(orderLines) && orderLines.length > 0) {
      const newLines = orderLines.map(line => ({
        orderId,
        productId: line.productId,
        productDetailId: line.productDetailId,
        quantity: line.quantity,
        price: line.price,
      }));
      await OrderLine.insertMany(newLines);
    }

    return res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating order", error: error.message });
  }
});

// ---------------------------
// Delete order and its lines
// ---------------------------
export const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Delete all order lines for this order
    await OrderLine.deleteMany({ orderId });

    // Delete the order itself
    await Order.findByIdAndDelete(orderId);

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting order", error: error.message });
  }
});
