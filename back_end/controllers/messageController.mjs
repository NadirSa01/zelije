import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.mjs";
import Client from "../models/clientModel.mjs";

export const addMessage = asyncHandler(async (req, res) => {
  const { fullName, telephone, address, city, subject, message } =
    req.body;
  try {
    if (
      !fullName ||
      !telephone ||
      !address ||
      !city ||
      !subject ||
      !message
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // we check client if exists before add it
    const checkcClientIfExists = await Client.findOne({ telephone });
    if (checkcClientIfExists) {
      const newMessage = await Message.create({
        clientId: checkcClientIfExists._id,
        subject,
        message,
      });
      return res
        .status(200)
        .json({ message: "Message sent successfully", newMessage });
    } else {
      const newClient = await Client.create({
        fullName,
        telephone,
        address,
        city,
      });
      const newMessage = await Message.create({
        clientId: newClient._id,
        subject,
        message,
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
    const { search, from, to, status } = req.query;

      const page = Math.max(1, parseInt(req.query.page ?? "1", 10));
      const rawLimit = parseInt(req.query.limit ?? "10", 10);
      const limit = Math.min(Math.max(1, isNaN(rawLimit) ? 10 : rawLimit), 100);

    const query = {};

    if (search && search.trim()) {
      query.subject = { $regex: search.trim() };
    }

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    if (status === "true") query.status = true;
    if (status === "false") query.status = false;

    const [messages, total] = await Promise.all([
      Message.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Message.countDocuments(query),
    ]);

    const pages = Math.max(1, Math.ceil(total / limit));

    return res.status(200).json({
      total,
      page,
      pages,
      limit,
      messages,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching messages", error });
  }
});


export const getMessagesById = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  try {
    const message = await Message.find({ _id: messageId });
    if (message.status === false) {
      message.status = true;
      await message.save();
    }
    return res.status(200).json({ message });
  } catch (error) {
    return res.status(500).json({ Message: "Error fetching messages", error });
  }
});

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

export const deleteMessage=asyncHandler(async(req,res)=>{
const {id}=req.params;
console.log(id);

try {
  const deleteMessage = await Message.findByIdAndDelete(id);
  if (!deleteMessage) {
    return res.status(404).json({ message: "Message not found" });
  }
  return res.status(200).json({ message: "Message deleted successfully" });
} catch (error) {
    res.status(500).json({ message: "Error deleting message", error });
}
})
