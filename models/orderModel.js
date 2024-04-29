const mongoose = require("mongoose");

// Order Schema
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  total: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Confirmed", "Shipped"],
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
