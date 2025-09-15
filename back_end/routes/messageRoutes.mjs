import express from "express";
import { addMessage, deleteMessage, getMessages, getMessagesByClientId, getMessagesById } from "../controllers/messageController.mjs";
import { verifyToken } from "../middlewares/verifyToken.mjs";

const MessageRouter = express.Router();
MessageRouter.post("/clientMessages",verifyToken, getMessagesByClientId);
MessageRouter.post("/message", addMessage);
MessageRouter.get("/message/:messageId",verifyToken, getMessagesById);
MessageRouter.get("/messages",verifyToken, getMessages);
MessageRouter.delete("/message/:id",verifyToken, deleteMessage);
export default MessageRouter;