import asyncHandler from "express-async-handler";
import ServiceOrder from "../models/serviceOrderModel.mjs";
import Client from "../models/clientModel.mjs";
import Service from "../models/serviceModel.mjs";
// Create ServiceOrder
export const createServiceOrder = asyncHandler(async (req, res) => {
  const { clientData, serviceId, description } = req.body;

  try {
    const client = await Client.create({
      fullName: clientData.fullName,
      telephone: clientData.telephone,
      address: clientData.address,
      city: clientData.city,
    });
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(400).json({ message: "Cannot find Service " });
    }
    const newOrder = await ServiceOrder.create({
      clientId: client._id,
      serviceId: service._id,
      description: description,
    });

    return res
      .status(201)
      .json({ message: "Service order created successfully", newOrder });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating service order", error });
  }
});

export const getServiceOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await ServiceOrder.find()
      .sort({ createdAt: -1 })
      .populate("clientId")
      .populate("serviceId")
      .lean();

    const ordersWithDetails = orders.map((order) => ({
      _id: order._id,
      description: order.description,
      state: order.state,
      price: order.price,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      client: order.clientId,
      service: order.serviceId,
    }));

    return res.status(200).json({
      total: orders.length,
      orders: ordersWithDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching service orders" });
  }
});
// Get ServiceOrder by ID
export const getServiceOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderV0 = await ServiceOrder.findById(orderId)
      .populate("clientId", "fullName telephone address city")
      .populate("serviceId", "name description highPrice lowPrice image")
      .lean();

    if (!orderV0) {
      return res.status(404).json({ message: "Service order not found" });
    }

    const order = {
      _id: orderV0._id,
      description: orderV0.description,
      state: orderV0.state,
      price: orderV0.price,
      createdAt: orderV0.createdAt,
      updatedAt: orderV0.updatedAt,
      client: orderV0.clientId,
      service: orderV0.serviceId,
    };

    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching service order" });
  }
});

export const updateServiceOrderPrice = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { newPrice } = req.body; 
   
  try {
    if (!orderId || !newPrice ) {
        return res.status(400).json({message:"All field required"})
    }
    const updatePrice = await ServiceOrder.findByIdAndUpdate(
      { _id: orderId },
      { price:newPrice},
      {new:true}
    );    
    if (!updatePrice) {
      return res.status(400).json({message:"Order not found "})
    }
    return res.status(200).json({message:"Price updated with success"})
  } catch (err) {
    return res.status(400).json({message:err})
  }
});
export const updateServiceOrderState = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { newState } = req.body; 
   
  try {
    if (!orderId || !newState ) {
        return res.status(400).json({message:"All field required"})
    }
    const updatePrice = await ServiceOrder.findByIdAndUpdate(
      { _id: orderId },
      { state:newState},
      {new:true}
    );    
    if (!updatePrice) {
      return res.status(400).json({message:"Order not found "})
    }
    return res.status(200).json({message:"Price updated with success"})
  } catch (err) {
    return res.status(400).json({message:err})
  }
});
// Update ServiceOrder
export const updateServiceOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { state, price, address, quantity, description } = req.body;

  try {
    const order = await ServiceOrder.findById(orderId);
    if (!order)
      return res.status(404).json({ message: "Service order not found" });

    order.state = state || order.state;
    order.price = price ?? order.price;
    order.address = address || order.address;
    order.quantity = quantity ?? order.quantity;
    order.description = description || order.description;

    await order.save();
    return res
      .status(200)
      .json({ message: "Service order updated successfully", order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating service order", error });
  }
});

// Delete ServiceOrder
export const deleteServiceOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await ServiceOrder.findByIdAndDelete(orderId);
    if (!order)
      return res.status(404).json({ message: "Service order not found" });

    return res
      .status(200)
      .json({ message: "Service order deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting service order", error });
  }
});
