// authMiddleware.js
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.mjs";

export const verifyToken = asyncHandler(async (req, res, next) => {
    
  let token = req.cookies.token; // 👈 read cookie
  if (!token) {
    // fallback to Authorization header if needed
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }
  if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const admin = await Admin.findById(decoded.id);
    if (!admin)
      return res.status(401).json({ message: "User no longer exists" });

    req.admin = admin;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(403).json({ message: "Forbidden, invalid or expired token" });
  }
});

