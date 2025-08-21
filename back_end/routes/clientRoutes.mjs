import express from "express";
import { createClient, deleteClient, getClients, searchClients, updateClient } from "../controllers/clientController.mjs";
const ClientRouter  = express.Router();


ClientRouter.get("/client", getClients);
ClientRouter.delete("/client/:clientId", deleteClient);
ClientRouter.put("/client/:clientId", updateClient);
ClientRouter.post("/client", createClient);
ClientRouter.post("/clientSearch", searchClients);
export default ClientRouter;