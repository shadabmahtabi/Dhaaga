const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    date: String,
    time: String,
    category: String,
    designer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Designer"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Appointment", appointmentSchema);