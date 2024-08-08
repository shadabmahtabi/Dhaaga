const mongoose = require("mongoose");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const designerSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
      select: false,
    },
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
    category: {
        type: String,
        enum: ["bridal", "groom", "hotel", "personal"],
        default: "bridal",
        required: true
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
  This function runs when .save() method is called and hash the password.
*/
designerSchema.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }

  let salt = bycrpt.genSaltSync(10);
  this.password = bycrpt.hashSync(this.password, salt);
});

/*
    This method is used to compare the passwords and returns true or false.
*/
designerSchema.methods.comparePassword = function (password) {
  return bycrpt.compareSync(password, this.password);
};

/*
    This method is used to create jwt token.
*/
designerSchema.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("Designer", designerSchema);