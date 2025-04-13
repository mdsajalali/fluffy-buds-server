import cors from "cors";
import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import { createProduct } from "./controllers/product.controller.js";

// app config
const app = express();
const port = 5000;

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

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
