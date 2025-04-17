import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/user.model.js";

// Create JWT token with role
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id, user.role);

    res.json({
      success: true,
      message: "Login successfully.",
      token,
    });
  } catch (error) {
    console.log("Login error:", error);
    return res.json({ success: false, message: "Login failed" });
  }
};

// Register user 
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, role } =
    req.body;

  try {
    // Check if user already exists
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Confirm password match
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      confirmPassword,
      role: role || "user",
    });

    const user = await newUser.save();

    // Create token with id and role
    const token = createToken(user._id, user.role);

    return res.json({
      success: true,
      message: "User created successfully.",
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.json({ success: false, message: "Registration failed" });
  }
};

export { registerUser, loginUser };
