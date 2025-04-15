import express from "express";
import authMiddleware from "../middleware/auth.js";
import { addToCart } from "../controllers/cart.controller.js";
const cartRoute = express.Router();

cartRoute.post("/add", authMiddleware, addToCart);

export default cartRoute;
