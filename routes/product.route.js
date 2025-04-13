import express from "express";
import { createProduct, deleteProduct, getProducts } from "../controllers/product.controller.js";
const productRoute = express.Router();

productRoute.get("/products", getProducts);
productRoute.post("/create-product", createProduct);
productRoute.delete("/delete-product/:id", deleteProduct);

export default productRoute;
