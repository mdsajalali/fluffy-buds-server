import Stripe from "stripe";
import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// place order
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();

    // Clear cart after placing order
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Stripe payment line items
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Add delivery charges
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// verify order if order cancel then not show this order db or not count
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// list orders
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// update status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// getTotalUserOrders;
const getTotalUserOrdersSales = async (req, res) => {
  try {
    const totalUsers = await userModel.estimatedDocumentCount();
    const totalOrders = await orderModel.estimatedDocumentCount();

    // Calculate total sales (sum of all order amounts)
    const orders = await orderModel.find({}, "amount");
    const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);

    res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      totalUsers,
      totalOrders,
      totalSales,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

// getLast12MonthsSales
const getLast12MonthsSales = async (req, res) => {
  try {
    const last12MonthsSales = await orderModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(
              new Date().setFullYear(new Date().getFullYear() - 1)
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
          },
          totalSales: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          totalSales: 1,
        },
      },
      {
        $limit: 12,
      },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    last12MonthsSales.reverse();

    const formattedSalesData = last12MonthsSales.map((item) => ({
      month: monthNames[item.month - 1],
      sales: item.totalSales,
    }));

    res.status(200).json({ success: true, data: formattedSalesData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// recent orders
const recentOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  getLast12MonthsSales,
  getTotalUserOrdersSales,
  listOrders,
  placeOrder,
  recentOrders,
  updateStatus,
  userOrders,
  verifyOrder,
};
