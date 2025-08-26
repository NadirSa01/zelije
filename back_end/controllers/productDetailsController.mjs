import asyncHandler from "express-async-handler";
import ProductDetail from "../models/productDetailModel.mjs";
import Product from "../models/productModel.mjs";
import mongoose from "mongoose";


// ---------------------------
// DELETE a product detail
// ---------------------------

export const deleteProductDetail = asyncHandler(async (req, res) => {
  const { detailId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(detailId)) {
    return res.status(400).json({ message: "Invalid detail ID" });
  }

  try {
    const objectId = new mongoose.Types.ObjectId(detailId);

    const detail = await ProductDetail.findByIdAndDelete(objectId);

    if (!detail) {
      return res.status(404).json({ message: "Product detail not found" });
    }

    return res.status(200).json({
      message: "Product detail deleted successfully",
      deletedDetailId: detail._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting product detail",
      error: error.message,
    });
  }
});

