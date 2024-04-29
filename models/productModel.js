const mongoose = require("mongoose");

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: "" },
  stocks: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
