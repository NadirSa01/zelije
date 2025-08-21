import asyncHandler from "express-async-handler";
import Service from "../models/serviceModel.mjs";

// --------------------------- CREATE SERVICE ---------------------------
export const createService = asyncHandler(async (req, res) => {
  const { name, description, highPrice, lowPrice, image } = req.body;

  // Validate required fields and at least one image
  if (
    !name ||
    !description ||
    highPrice == null ||
    lowPrice == null ||
    !image ||
    !Array.isArray(image) ||
    image.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required and at least one image must be provided" });
  }

  try {
    const service = await Service.create({ name, description, highPrice, lowPrice, image });
    return res.status(201).json({ message: "Service created successfully", service });
  } catch (error) {
    return res.status(500).json({ message: "Error creating service", error: error.message });
  }
});

// --------------------------- GET ALL SERVICES ---------------------------
export const getServices = asyncHandler(async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ total: services.length, services });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching services", error: error.message });
  }
});

// --------------------------- GET SERVICE BY ID ---------------------------
export const getServiceById = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  try {
    const service = await Service.findById(serviceId).lean();
    if (!service) return res.status(404).json({ message: "Service not found" });
    return res.status(200).json({ service });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching service", error: error.message });
  }
});

// --------------------------- UPDATE SERVICE ---------------------------
export const updateService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const { name, description, highPrice, lowPrice, image } = req.body;

  try {
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    service.name = name || service.name;
    service.description = description || service.description;
    service.highPrice = highPrice ?? service.highPrice;
    service.lowPrice = lowPrice ?? service.lowPrice;

    // Only replace images if provided and is a non-empty array
    if (image && Array.isArray(image) && image.length > 0) service.image = image;

    await service.save();
    return res.status(200).json({ message: "Service updated successfully", service });
  } catch (error) {
    return res.status(500).json({ message: "Error updating service", error: error.message });
  }
});

// --------------------------- DELETE SERVICE ---------------------------
export const deleteService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  try {
    const service = await Service.findByIdAndDelete(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    return res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting service", error: error.message });
  }
});
  