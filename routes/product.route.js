import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.controller.js";
const productRoute = express.Router();

productRoute.get("/products", getProducts);
productRoute.get("/product/:id", getSingleProduct);
productRoute.post("/create-product", createProduct);
productRoute.delete("/delete-product/:id", deleteProduct);
productRoute.put("/update-product/:id", updateProduct);

export default productRoute;
