const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      // Email validation regex
      validate: [/^\S+@\S+\.\S+$/, "Please fill a valid email address"],
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);
