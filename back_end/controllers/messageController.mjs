import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.mjs";
import Client from "../models/clientModel.mjs";
import mongoose from "mongoose";

export const addMessage = asyncHandler(async (req, res) => {
  const { name, address, phone, city, subject, message } = req.body;
  
  try {
    // if (!name || !address || !city || !hone || !subject || !message) {
    //   return res.status(400).json({ message: "All Field required" });
    // }
    const client = await Client.create({
      fullName:name,
      address:address,
      telephone:phone,
      city:city,
    });
    if (client) {
      const newMessage = await Message.create({
        clientId: client._id,
        subject,
        message,
        status:false
      });
      return res
        .status(201)
        .json({ message: "Message sent successfully", newMessage });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error sending message", error });
  }
});

export const getMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $lookup: {
          from: "clients", // collection name in MongoDB (lowercase + plural of model)
          localField: "clientId", // field in Message
          foreignField: "_id", // field in Client
          as: "client", // output array field
        },
      },
      {
        $unwind: "$client", // convert client array to single object
      },
      {
        $sort: { createdAt: -1 }, // newest first
      },
      {
        $project: {
          // optional: shape response
          _id: 1,
          subject: 1,
          message: 1,
          status: 1,
          createdAt: 1,
          "client._id": 1,
          "client.fullName": 1,
          "client.telephone": 1,
          "client.address": 1,
          "client.city": 1,
        },
      },
    ]);

    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export const getMessagesById = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const _id = new mongoose.Types.ObjectId(messageId);

    // Update status first (only if it was false)
    await Message.updateOne({ _id, status: false }, { $set: { status: true } });

    // Then fetch with client info
    const [message] = await Message.aggregate([
      { $match: { _id } },
      {
        $lookup: {
          from: "clients", // collection name for Client model
          localField: "clientId", // <-- correct field in Message schema
          foreignField: "_id",
          as: "client",
        },
      },
      // If you want to keep messages even if client is missing, set preserveNullAndEmptyArrays: true
      { $unwind: { path: "$client", preserveNullAndEmptyArrays: false } },
      {
        $project: {
          _id: 1,
          subject: 1,
          message: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          client: {
            _id: "$client._id",
            fullName: "$client.fullName",
            telephone: "$client.telephone",
            address: "$client.address",
            city: "$client.city",
          },
        },
      },
    ]);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json({ message });
  } catch (error) {
    console.error("getMessagesById error:", error);
    return res.status(500).json({ message: "Error fetching message", error });
  }
});

// export const getMessagesById = asyncHandler(async (req, res) => {
//   const { messageId } = req.params;
//   try {
//     const message = await Message.find({ _id: messageId });
//     if (message.status === false) {
//       message.status = true;
//       await message.save();
//     }
//     return res.status(200).json({ message });
//   } catch (error) {
//     return res.status(500).json({ Message: "Error fetching messages", error });
//   }
// });

export const getMessagesByClientId = asyncHandler(async (req, res) => {
  // const { clientId, status } = req.body;
  const { clientId } = req.body;

  if (!clientId) {
    return res.status(400).json({ message: "ClientId is required" });
  }

  try {
    const query = { clientId };

    // if (status === true || status === false) {
    //   query.status = status;
    // }

    const messages = await Message.find(query).sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      total: messages.length,
      messages,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching messages", error });
  }
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deleteMessage = await Message.findByIdAndDelete(id);
    if (!deleteMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message", error });
  }
});
