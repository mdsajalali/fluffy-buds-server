import express from "express";
import {
  getLast12MonthsSales,
  getTotalUserOrdersSales,
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
orderRoute.get("/get-total-user-order-sales", getTotalUserOrdersSales);
orderRoute.get("/get-last12-months-sales", getLast12MonthsSales);

export default orderRoute;
