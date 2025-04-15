import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    cartData: { type: Object, default: {} },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { minimize: false }
);

// Remove confirmPassword before saving
userSchema.pre("save", function (next) {
  this.confirmPassword = undefined;
  next();
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
