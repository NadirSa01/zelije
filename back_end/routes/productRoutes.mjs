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

const ProductRouter = express.Router();
ProductRouter.delete("/detail/:detailId", deleteProductDetail);
ProductRouter.delete("/product/:productId", deleteProduct);
ProductRouter.put("/product/:productId", updateProduct);
ProductRouter.post("/product", createProductWithDetails);
ProductRouter.get("/products", getProducts);
ProductRouter.get("/product/:productId", getProductById);


///////////////////
//Minio Routes 
////////////////

ProductRouter.post("/upload-image", uploadMiddleware, uploadProductImage);
export default ProductRouter;
