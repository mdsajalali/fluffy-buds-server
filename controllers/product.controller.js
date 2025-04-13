import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/product.model.js";

// create product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, category, sizes, colors } =
      req.body;

    if (!req.files || !req.files.images) {
      return res.status(400).json({ errors: "No file uploaded" });
    }

    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    const uploadedImages = [];

    for (const file of files) {
      const type = file.mimetype.toLowerCase();

      if (!allowedFormats.includes(type)) {
        return res.status(400).json({
          errors: "Invalid file format. Only PNG, JPEG, and JPG are allowed",
        });
      }

      const cloud_response = await cloudinary.uploader.upload(
        file.tempFilePath
      );

      if (!cloud_response || cloud_response.error) {
        return res.status(400).json({
          errors: "Error uploading file to Cloudinary",
        });
      }

      uploadedImages.push({ url: cloud_response.url });
    }

    const product = new productModel({
      name,
      description,
      price,
      discount,
      category,
      sizes,
      colors,
      images: uploadedImages,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error creating product" });
  }
};

export { createProduct };
