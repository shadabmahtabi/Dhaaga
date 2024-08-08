const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  designer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Designer",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
