import express from "express";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  verifyOrder,
} from "../controllers/order.controller.js";
import authMiddleware from "../middleware/auth.js";
const orderRoute = express.Router();

orderRoute.post("/place", authMiddleware, placeOrder);
orderRoute.post("/verify", verifyOrder);
orderRoute.post("/my-orders", authMiddleware, userOrders);
orderRoute.get("/list", listOrders);
orderRoute.post("/status", updateStatus);

export default orderRoute;
