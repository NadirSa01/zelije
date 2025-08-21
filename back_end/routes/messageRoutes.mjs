import express from "express";
import { addMessage, deleteMessage, getMessages, getMessagesByClientId, getMessagesById } from "../controllers/messageController.mjs";

const MessageRouter = express.Router();
MessageRouter.post("/clientMessages", getMessagesByClientId);
MessageRouter.post("/message", addMessage);
MessageRouter.get("/message/:messageId", getMessagesById);
MessageRouter.get("/messages", getMessages);
MessageRouter.delete("/message/:id", deleteMessage);
export default MessageRouter;