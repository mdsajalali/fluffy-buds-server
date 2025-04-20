import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/product.model.js";

// get all products with filters, pagination, and sorting
const getProducts = async (req, res) => {
  try {
    const { page = 1, name, minPrice, maxPrice, category, sort } = req.query;

    const filters = {};
    if (name) {
      filters.name = { $regex: name, $options: "i" };
    }
    if (minPrice && maxPrice) {
      filters.price = { $gte: minPrice, $lte: maxPrice };
    }

    if (category) {
      filters.category = category;
    }

    // Pagination settings
    const perPage = 6;
    const skip = (page - 1) * perPage;

    let sortCriteria = { createdAt: -1 };

    if (sort) {
      if (sort === "highToLow") {
        sortCriteria = { price: -1 };
      } else if (sort === "lowToHigh") {
        sortCriteria = { price: 1 };
      }
    }

    // Get total product count based on filters
    const totalProducts = await productModel.countDocuments(filters);

    // Fetch products with pagination and sorting
    const products = await productModel
      .find(filters)
      .skip(skip)
      .limit(perPage)
      .sort(sortCriteria);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / perPage),
        totalProducts,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
    });
  }
};

// get all product without filters
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// get single product
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// create product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, category } =
      req.body;

    if (!req.files || !req.files.images) {
      return res.status(400).json({ errors: "No file uploaded" });
    }

    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    const allowedFormats = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];
    const uploadedImages = [];

    for (const file of files) {
      const type = file.mimetype.toLowerCase();

      if (!allowedFormats.includes(type)) {
        return res.status(400).json({
          errors:
            "Invalid file format. Only PNG, JPEG, JPG and WEBP are allowed",
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

// product delete by id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
    });
  }
};

// update product by id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, discount, category } =
      req.body;

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        discount,
        category,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
    });
  }
};

// getTotalProductQuantity
const getTotalProductQuantity = async (req, res) => {
  try {
    const getTotalProducts = await productModel.estimatedDocumentCount();
    res.status(200).json({ success: true, getTotalProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// get recently added products limit 4
const newArrivals = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 }).limit(4);
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProducts,
  getSingleProduct,
  getTotalProductQuantity,
  newArrivals,
  updateProduct,
};
