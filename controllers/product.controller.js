import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/product.model.js";

// create product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, category, sizes, colors } =
      req.body;

    const { images } = req.files;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ errors: "No file uploaded" });
    }

    const allowedFormat = ["image/png", "image/jpeg"];
    if (!allowedFormat.includes(images.mimetype)) {
      return res
        .status(400)
        .json({ errors: "Invalid file format. Only PNG and JPG are allowed" });
    }

    // cloudinary code start here
    const cloud_response = await cloudinary.uploader.upload(
      images.tempFilePath
    );

    if (!cloud_response || cloud_response.error) {
      return res
        .status(400)
        .json({ errors: "Error uploading file to cloudinary" });
    }

    // cloudinary code end here

    const product = new productModel({
      name,
      description,
      price,
      discount,
      category,
      sizes,
      colors,
      images: {
        url: cloud_response.url,
      },
    });

    await product.save();
    res.json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error creating product" });
  }
};

export { createProduct };
