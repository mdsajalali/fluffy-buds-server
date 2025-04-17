import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import "dotenv/config";
import express from "express";
import fileUpload from "express-fileupload";
import { connectDB } from "./config/db.js";
import cartRoute from "./routes/cart.route.js";
import orderRoute from "./routes/order.route.js";
import productRoute from "./routes/product.route.js";
import userRoute from "./routes/user.route.js";

// app config
const app = express();
const port = process.env.PORT || 5000;

// db connection
connectDB();

// middleware
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// api endpoints
app.use("/api/v1", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.get("/api/v1", (req, res) => {
  res.send("Welcome to fluffy buds!");
});

// cloudinary configuration code
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

app.listen(port, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
