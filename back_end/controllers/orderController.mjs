import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/orderModel.mjs";
import OrderLine from "../models/OrderLineModel.mjs";
import Client from "../models/clientModel.mjs";
import Product from "../models/productModel.mjs";
// ---------------------------
// Create order + lines
// ---------------------------
export const createOrder = asyncHandler(async (req, res) => {
  const { data, orderPayload } = req.body;
  try {
    const client = await Client.create(data);

    const order = await Order.create({ clientId: client._id });

    if (order) {
      await Promise.all(
        orderPayload.map(async (element) => {
          const findProduct = await Product.findById(element.productId);
          if (!findProduct) {
            throw new Error(`Product not found: ${element.productId}`);
          }

          await OrderLine.create({
            orderId: order._id,
            productId: findProduct._id,
            productDetailId: element.productDetailId,
            quantity: element.quantity,
            price: findProduct.price,
          });
        })
      );

      return res.status(200).json({ message: "Order created with success" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

// ---------------------------
// Get all orders with lines
// ---------------------------
export const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("clientId")
      .lean();

    const orderIds = orders.map((o) => o._id);

    const lines = await OrderLine.find({ orderId: { $in: orderIds } }).lean();

    const ordersWithDetails = orders.map((order) => ({
      ...order,
      orderLines: lines.filter(
        (line) => line.orderId.toString() === order._id.toString()
      ),
    }));

    return res.status(200).json({
      total: orders.length,
      orders: ordersWithDetails,
    });
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

    const client = await Client.findById(order.clientId).lean();
    if (!client) return res.status(404).json({ message: "Client not found" });

    // aggregate OrderLines with ProductDetail
    const lines = await OrderLine.aggregate([
      { $match: { orderId: new mongoose.Types.ObjectId(orderId) } },
      {
        $lookup: {
          from: "productdetails", // collection name (lowercase + plural of model)
          localField: "productDetailId",
          foreignField: "_id",
          as: "productDetail",
        },
      },
      { $unwind: "$productDetail" }, // flatten array
      {
        $lookup: {
          from: "products", // if you also want product info
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 1,
          orderId: 1,
          quantity: 1,
          price: { $toDouble: "$price" }, // convert Decimal128 → number
          createdAt: 1,
          updatedAt: 1,
          "product._id": 1,
          "product.name": 1,
          "productDetail._id": 1,
          "productDetail.picture": 1,
          "productDetail.colorName": 1,
          "productDetail.colorCode": 1,
        },
      },
    ]);

    return res.status(200).json({
      ...order,
      client,
      orderLines: lines,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
});

export const updateQuantity = asyncHandler(async (req, res) => {
  const { orderLineId } = req.params;
  const { newqty } = req.body;

  
  try {
    const order = await OrderLine.findByIdAndUpdate(
      { _id: orderLineId },
      { quantity: newqty }
    );
    res.status(200).json({message : "Quantity updated with success"})
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const updateState = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { state } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { state },
      { new: true }
    )
      .populate("clientId")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// ---------------------------
// Update order and replace lines
// ---------------------------
export const updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const {
    clientId,
    state,
    price,
    installationRequired,
    installationCost,
    orderLines,
  } = req.body;

  try {
    // Step 1: find the order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Step 2: update order fields
    order.clientId = clientId || order.clientId;
    order.state = state || order.state;
    order.price = price ?? order.price;
    order.installationRequired =
      installationRequired ?? order.installationRequired;
    order.installationCost = installationCost ?? order.installationCost;

    await order.save();

    // Step 3: replace order lines
    await OrderLine.deleteMany({ orderId });

    if (Array.isArray(orderLines) && orderLines.length > 0) {
      const newLines = orderLines.map((line) => ({
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
    return res
      .status(500)
      .json({ message: "Error updating order", error: error.message });
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
    return res
      .status(500)
      .json({ message: "Error deleting order", error: error.message });
  }
});
