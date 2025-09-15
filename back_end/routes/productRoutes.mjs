import express from "express";
import {
  createProductWithDetails,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/productController.mjs";
import { deleteProductDetail } from "../controllers/productDetailsController.mjs";
import { uploadMiddleware, uploadProductImage } from "../controllers/uploadController..mjs";
import { verifyToken } from "../middlewares/verifyToken.mjs";

const ProductRouter = express.Router();
ProductRouter.delete("/detail/:detailId",verifyToken, deleteProductDetail);
ProductRouter.delete("/product/:productId",verifyToken, deleteProduct);
ProductRouter.put("/product/:productId",verifyToken, updateProduct);
ProductRouter.post("/product",verifyToken, createProductWithDetails);
ProductRouter.get("/products", getProducts);
ProductRouter.get("/product/:productId",verifyToken, getProductById);


///////////////////
//Minio Routes 
////////////////

ProductRouter.post("/upload-image", uploadMiddleware, uploadProductImage);
export default ProductRouter;
