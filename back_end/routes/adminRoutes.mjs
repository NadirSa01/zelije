import express from "express" ;
import { createAdmin, getMe, loginAdmin, logoutAdmin, updateAdmin } from "../controllers/adminController.mjs";
import { verifyToken } from "../middlewares/verifyToken.mjs";

const AdminRouter = express.Router();

AdminRouter.post("/admin", createAdmin);
AdminRouter.post("/admin/login", loginAdmin);
AdminRouter.post("/admin/logout", logoutAdmin);
AdminRouter.get("/admin/me",verifyToken, getMe);
AdminRouter.put("/admin/:id", updateAdmin);
export default AdminRouter;
