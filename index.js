import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import "dotenv/config";
import express from "express";
import fileUpload from "express-fileupload";
import { connectDB } from "./config/db.js";
import productRoute from "./routes/product.route.js";

// app config
const app = express();
const port = 5000;

// db connection
connectDB();

// middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5175",
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
