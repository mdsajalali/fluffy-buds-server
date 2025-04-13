import productModel from "../models/product.model.js";

// create product
const createProduct = async (req, res) => {
  let images = req.body.filename;
  try {
    const { name, description, price, discount, category, sizes, colors } =
      req.body;

    const product = new productModel({
      name,
      description,
      price,
      discount,
      category,
      sizes,
      colors,
      images,
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
