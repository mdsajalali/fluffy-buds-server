import cors from "cors";
import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import { createProduct } from "./controllers/product.controller.js";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";

// app config
const app = express();
const port = 5000;
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// db connection
connectDB();

// middleware
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/v1/api", createProduct);

app.get("/", (req, res) => {
  res.send("API Working");
});

// cloudinary configuration code
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
