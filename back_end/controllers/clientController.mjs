import asyncHandler from "express-async-handler";
import Client from "../models/clientModel.mjs";
export const createClient = asyncHandler(async (req, res) => {
  const { fullName, telephone, address, city } = req.body;
  try {
    if (!fullName || !telephone || !address || !city) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newClient = await Client.create({
      fullName,
      telephone,
      address,
      city,
    });
    return res
      .status(201)
      .json({ message: "Client created successfully", newClient });
  } catch (error) {
    return res.status(500).json({ message: "Error creating client", error });
  }
});

export const getClients = asyncHandler(async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Clients fetched successfully",
      clients: clients,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching clients", error });
  }
});

export const searchClients = asyncHandler(async (req, res) => {
  const { query: searchText } = req.body; // single input from frontend

  try {
    // If no search text is provided, return all clients
    if (!searchText || !searchText.trim()) {
      const clients = await Client.find().sort({ fullName: 1 }).lean();
      return res.status(200).json({ total: clients.length, clients });
    }

    const regex = { $regex: searchText.trim(), $options: "i" }; // case-insensitive

    // Search across multiple fields
    const clients = await Client.find({
      $or: [{ fullName: regex }, { telephone: regex }, { city: regex }],
    })
      .sort({ fullName: 1 })
      .lean();

    return res.status(200).json({
      total: clients.length,
      clients,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error searching clients", error });
  }
});

export const updateClient = asyncHandler(async (req, res) => {
  const { clientId } = req.params;
  const { data } = req.body;
  try {
    const client = await Client.findByIdAndUpdate(
      {_id:clientId},
      data
    );
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    return res
      .status(200)
      .json({ message: "Client updated successfully", client });
  } catch (error) {
    return res.status(500).json({ message: "Error updating client", error });
  }
});

export const deleteClient = asyncHandler(async (req, res) => {
  const { clientId } = req.params;
  try {
    const client = await Client.findByIdAndDelete(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    return res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting client", error });
  }
});
