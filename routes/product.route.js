import express from "express";
const productRoute = express.Router();

productRoute.post("/create-product", createPor);

export default productRoute;
