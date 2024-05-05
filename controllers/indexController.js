const { catchAsynchErrors } = require("../middlewares/catchAsynchErrors");
const otpModel = require("../models/otpModel");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendmail } = require("../utils/sendMail");
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
  res.status(201).json("Book Designer");
});

/*
  Controller function for sending otp from email or mobile number.
*/
exports.sendOtp = catchAsynchErrors(async (req, res, next) => {
  sendmail(req, res, next);

  /*
  // This helps in sending otp using mobile number.
  let { mobileNumber } = req.body;
  let response = await sendOTP(mobileNumber);
  if (response.status != 'pending') return next(new ErrorHandler(response.message, response.status));
  res.status(201).json("Otp sent Successfully.");
  */
});

/*
  Controller function for verifying otp sent on email or mobile number.
*/
exports.verifyOtp = catchAsynchErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  let response = await otpModel.findOne({ email: email }).exec();
  if (!response) return next(new ErrorHandler("Invalid Email", 404));

  if (response.otp != otp) {
    return next(new ErrorHandler("Invalid OTP", 404))
  }else {
    await otpModel.findOneAndDelete({email: email}).catch(err => {return next(new ErrorHandler(err.message, 500))})
  };

  /*
    // This helps in verifying otp sent on mobile number.
    let { mobileNumber, otp } = req.body;
    let response = await verifyOTP(mobileNumber, otp);
    if (response.status != "approved")
    return next(new ErrorHandler(response.message, response.status));
  */

  res.status(200).json("OTP Verified!");
});
