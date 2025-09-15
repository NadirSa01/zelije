import asyncHandler from "express-async-handler";
import Product from "../models/productModel.mjs";
import ProductDetail from "../models/productDetailModel.mjs";
import mongoose from "mongoose";

// ---------------------------
// Create a new product
// ---------------------------
export const createProductWithDetails = asyncHandler(async (req, res) => {
  const { name, price, size, type, details } = req.body;

  // 1. Validate that details exist
  if (!details || !Array.isArray(details) || details.length === 0) {
    return res.status(400).json({
      message: "At least one product detail is required.",
    });
  }

  // 2. Create product first
  const product = await Product.create({ name, price, size, type });

  const detailsToInsert = details.map((d) => ({
    ...d,
    productId: product._id,
  }));

  const insertedDetails = await ProductDetail.insertMany(detailsToInsert);

  return res.status(201).json({
    message: "Product with details created successfully",
    product,
    details: insertedDetails,
  });
});

// ---------------------------
// Get all products
// ---------------------------
export const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "productdetails",
          localField: "_id",
          foreignField: "productId",
          as: "details",
        },
      },
    ]);

    return res.status(200).json({ total: products.length, products });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching products", error });
  }
});

// ---------------------------
// Get a single product by ID
// ---------------------------
export const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  try {
    const product = await Product.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(productId) } },
      {
        $lookup: {
          from: "productdetails",
          localField: "_id",
          foreignField: "productId",
          as: "details",
        },
      },
    ]);

    if (!product || product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Wrap the product in an array to match frontend cache format
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching product", error });
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { payload } = req.body;

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid productId format" });
  }

  try {
    const ProductBody = {
      name: {
        en: payload.name.en,
        ar: payload.name.ar,
        fr: payload.name.fr,
      },
      price: payload.price,
      size: payload.size,
    };
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      { $set: ProductBody }
    );

    for (const detail of payload.details) {
      if (mongoose.Types.ObjectId.isValid(detail.id)) {
        await ProductDetail.findByIdAndUpdate(
          { _id: detail.id },
          {
            $set: {
              productId: productId,
              colorName: {
                en: detail.colorName.en,
                fr: detail.colorName.fr,
                ar: detail.colorName.ar
              },
              colorCode: detail.colorCode,
              quantity: detail.quantity,
              picture: detail.picture
            }
          },
          { upsert: true }
        );
      }else{
        await ProductDetail.create({
          productId: productId,
          colorName: {
            en: detail.colorName.en,
            fr: detail.colorName.fr,
            ar: detail.colorName.ar
          },
          colorCode: detail.colorCode,
          quantity: detail.quantity,
          picture: detail.picture
        });
      }
    }

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
    });
  } catch (error) {
    
    return res.status(500).json({ message: "Error updating product", error });
  }
});

// ---------------------------
// Delete product
// ---------------------------
export const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Optionally delete all related product details
    await ProductDetail.deleteMany({ productId });

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting product", error });
  }
});
