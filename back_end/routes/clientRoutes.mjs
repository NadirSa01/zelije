import express from "express";
import { createClient, deleteClient, getClients, searchClients, updateClient } from "../controllers/clientController.mjs";
import { verifyToken } from "../middlewares/verifyToken.mjs";
const ClientRouter  = express.Router();


ClientRouter.get("/client",verifyToken, getClients);
ClientRouter.delete("/client/:clientId",verifyToken, deleteClient);
ClientRouter.put("/client/:clientId",verifyToken, updateClient);
ClientRouter.post("/client",verifyToken, createClient);
ClientRouter.post("/clientSearch",verifyToken, searchClients);
export default ClientRouter;