import express from "express"
import { registerUser } from "../controllers/user.controller.js";
const userRoute = express.Router();

userRoute.post("/register", registerUser)

export default userRoute;