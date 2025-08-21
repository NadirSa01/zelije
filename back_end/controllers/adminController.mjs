import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.mjs";
import bcrypt from 'bcryptjs'; 
export const createAdmin = asyncHandler(async (req, res) => {
  const info = {
    firstName: "Nadir",
    lastName: "Satori",
    email: "nadir@gmail.com",
    password: "12345",
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
