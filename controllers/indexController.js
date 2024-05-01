const { catchAsynchErrors } = require("../middlewares/catchAsynchErrors");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendOTP, verifyOTP } = require("../utils/sendMessage");
const { sendToken } = require("../utils/sendToken");

/*
  Controller function for showing homepage.
*/
exports.homepage = catchAsynchErrors(async (req, res, next) => {
  res.json({
    message: "Secure homepage",
  });
});

/*
  Controller function to handle registration of a user.
*/
exports.userSignUp = catchAsynchErrors(async (req, res, next) => {
  // Sending back the created user with a response code of 201 which means 'Created'
  sendToken(await new userModel(req.body).save(), 201, res, next);
});

/*
  Controller function to handle login of a user.
*/

exports.userSignIn = catchAsynchErrors(async (req, res, next) => {
  const user = await userModel
    .findOne({ email: req.body.email })
    .select("+password");
  return !user || !user.comparePassword(req.body.password)
    ? next(new ErrorHandler("Wrong Credentials", 400))
    : sendToken(user, 200, res, next);
});

/*
  Controller function to handle login of a user.
*/
exports.userSignOut = catchAsynchErrors(async (req, res, next) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Successfully Signed Out!" });
});

/*
  Controller function for booking a designer.
*/
exports.bookDesigner = catchAsynchErrors(async (req, res, next) => {
  sendOTP(req, res, next);
});

exports.verifyDesigner = catchAsynchErrors(async (req, res, next) => {
  verifyOTP(req, res, next);
});
