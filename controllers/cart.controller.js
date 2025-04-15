import userModel from "../models/user.model.js";

// add to cart
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    let cartData = await userData.cartData;

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({
      success: false,
      message: "Product added to cart.",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to add product.",
    });
  }
};

export { addToCart };
