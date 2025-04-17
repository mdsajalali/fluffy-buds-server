import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProducts, 
  getSingleProduct,
  getTotalProductQuantity,
  newArrivals,
  updateProduct,
} from "../controllers/product.controller.js";
const productRoute = express.Router();

productRoute.get("/products", getProducts);
productRoute.get("/all-products", getAllProducts);
productRoute.get("/product/:id", getSingleProduct);
productRoute.get("/new-arrivals", newArrivals);
productRoute.post("/create-product", createProduct);
productRoute.delete("/delete-product/:id", deleteProduct);
productRoute.put("/update-product/:id", updateProduct);
productRoute.get("/get-total-product-quantity", getTotalProductQuantity);

export default productRoute;
