import express from "express";
import { createProduct, getProducts } from "../controllers/product.controller.js";
const productRoute = express.Router();

productRoute.get("/products", getProducts);
productRoute.post("/create-product", createProduct);

export default productRoute;
