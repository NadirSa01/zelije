import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.mjs";
import bcrypt from 'bcryptjs'; 
import jwt from "jsonwebtoken"
export const createAdmin = asyncHandler(async (req, res) => {
  const info = {
    firstName: "Mohamed",
    lastName: "bourrached",
    email: "mohamed@gmail.com",
    password: "zelijCap@2025",
  };
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(info.password, salt);
    const admin = await Admin.create({
      firstName: info.firstName,
      lastName: info.lastName,
      email: info.email,
      password: hashedPassword,
    });
    return res
      .status(201)
      .json({ message: "Admin created successfully", admin });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error });
  }

  res.status(201).json({ message: "Admin created successfully", admin });
});
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,       
      secure: true,         
      sameSite: "strict",   
      maxAge: 1000 * 60 * 60 * 24 * 3, 
    });

    return res.status(200).json({
      message: "Login successful",
      admin: {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }
});
export const getMe = asyncHandler(async (req, res) => {  
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) return res.status(404).json({ message: "User not found" });
    res.json(admin);
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
});

export const logoutAdmin = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    expires: new Date(0), 
    sameSite: "lax", 
    secure: false, 
  });
  res.status(200).json({ message: "Logout successful" });
});

export const updateAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password } = req.body;

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update admin details
    admin.firstName = firstName || admin.firstName;
    admin.lastName = lastName || admin.lastName;
    admin.email = email || admin.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    await admin.save();
    return res.status(200).json({ message: "Admin updated successfully", admin });
  } catch (error) {
    return res.status(500).json({ message: "Error updating admin", error });
  }
});
