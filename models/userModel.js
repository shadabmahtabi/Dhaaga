const mongoose = require("mongoose");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      // Email validation regex
      validate: [/^\S+@\S+\.\S+$/, "Please fill a valid email address"],
    },
    // password: {
    //   type: String,
    //   required: true,
    //   select: false,
    // },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    phoneNumber: {
      type: String,
      require: true,
      unique: true,
      minLength: ["10", "Phone number must be at least of 10 digits long."],
      maxLength: ["10", "Phone number must not exceeds 10 digits."],
      //   match: [/^\+91\s\d{10}$/, "Please fill a valid mobile number."]
    },
    appointments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment"
    }],
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    profilePicture: { type: String }, // URL to the profile picture
  },
  { timestamps: true }
);

/*
    This method is used to create jwt token.
*/
userSchema.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", userSchema);
