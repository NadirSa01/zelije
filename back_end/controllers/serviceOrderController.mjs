import asyncHandler from "express-async-handler";
import ServiceOrder from "../models/serviceOrderModel.mjs";

// Create ServiceOrder
export const createServiceOrder = asyncHandler(async (req, res) => {
  const { clientId, serviceId, description, price, address, quantity } = req.body;

  try {
    const newOrder = await ServiceOrder.create({
      clientId,
      serviceId,
      description,
      price,
      address,
      quantity,
    });

    return res.status(201).json({ message: "Service order created successfully", newOrder });
  } catch (error) {
    return res.status(500).json({ message: "Error creating service order", error });
  }
});

// Get all ServiceOrders
export const getServiceOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await ServiceOrder.find()
      .populate("clientId", "fullName  telephone")
      .populate("serviceId", "name description")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ total: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching service orders", error });
  }
});

// Get ServiceOrder by ID
export const getServiceOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await ServiceOrder.findById(orderId)
      .populate("clientId", "fullName  telephone")
      .populate("serviceId", "name description")
      .lean();

    if (!order) return res.status(404).json({ message: "Service order not found" });

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching service order", error });
  }
});

// Update ServiceOrder
export const updateServiceOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { state, price, address, quantity, description } = req.body;

  try {
    const order = await ServiceOrder.findById(orderId);
    if (!order) return res.status(404).json({ message: "Service order not found" });

    order.state = state || order.state;
    order.price = price ?? order.price;
    order.address = address || order.address;
    order.quantity = quantity ?? order.quantity;
    order.description = description || order.description;

    await order.save();
    return res.status(200).json({ message: "Service order updated successfully", order });
  } catch (error) {
    return res.status(500).json({ message: "Error updating service order", error });
  }
});

// Delete ServiceOrder
export const deleteServiceOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await ServiceOrder.findByIdAndDelete(orderId);
    if (!order) return res.status(404).json({ message: "Service order not found" });

    return res.status(200).json({ message: "Service order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting service order", error });
  }
});
