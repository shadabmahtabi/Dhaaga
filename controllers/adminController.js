const { catchAsynchErrors } = require("../middlewares/catchAsynchErrors");
const adminModel = require("../models/adminModel");
const ErrorHandler = require("../utils/ErrorHandler");
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
exports.adminSignUp = catchAsynchErrors(async (req, res, next) => {
  // Sending back the created user with a response code of 201 which means 'Created'
  sendToken(await new adminModel(req.body).save(), 201, res, next);
});

/*
  Controller function to handle login of a user.
*/

exports.adminSignIn = catchAsynchErrors(async (req, res, next) => {
  const user = await adminModel
    .findOne({ email: req.body.email })
    .select("+password");
  return !user || !user.comparePassword(req.body.password)
    ? next(new ErrorHandler("Wrong Credentials", 400))
    : sendToken(user, 200, res, next);
});

/*
  Controller function to handle login of a user.
*/
exports.adminSignOut = catchAsynchErrors(async (req, res, next) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Successfully Signed Out!" });
});
