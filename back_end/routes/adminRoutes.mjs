import express from "express" ;
import { createAdmin, updateAdmin } from "../controllers/adminController.mjs";

const AdminRouter = express.Router();

AdminRouter.post("/admin", createAdmin);
AdminRouter.put("/admin/:id", updateAdmin);
export default AdminRouter;
