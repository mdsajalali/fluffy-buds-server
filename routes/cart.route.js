import express from "express";
import { addToCart, removeFromCart } from "../controllers/cart.controller.js";
import authMiddleware from "../middleware/auth.js";
const cartRoute = express.Router();

cartRoute.post("/add", authMiddleware, addToCart);
cartRoute.post("/remove", authMiddleware, removeFromCart);

export default cartRoute;
