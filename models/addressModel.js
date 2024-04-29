const mongoose = require("mongoose");

// Address Schema
const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: Number, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
