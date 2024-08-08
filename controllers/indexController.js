const { catchAsynchErrors } = require("../middlewares/catchAsynchErrors");
const designerModel = require("../models/designerModel");
const otpModel = require("../models/otpModel");
const userModel = require("../models/userModel");
const appointmentModel = require("../models/appointmentModel");
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
  const { email, otp } = req.body;

  const otpFromDB = await otpModel
    .findOne({ email: email, type: "signup" })
    .exec();

  if (!otpFromDB) {
    return res.status(410).json({ message: "OTP expired!" });
  }

  if (otpFromDB.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  sendToken(await new userModel(req.body).save(), otpFromDB, 201, res, next);
});

/*
  Controller function to handle login of a user.
*/

exports.userSignIn = catchAsynchErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await userModel.findOne({ email }).exec();

  if (!user) {
    return next(new ErrorHandler("Wrong Credentials", 404));
  }

  const otpFromDB = await otpModel
    .findOne({ email: user.email, type: "signin" })
    .exec();

  if (!otpFromDB) {
    return res.status(410).json({ message: "OTP expired!" });
  }

  if (otpFromDB.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  return sendToken(user, otpFromDB, 200, res, next);
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
  const { date, time, category } = req.body;
  // const designer = await designerModel.findOne({ category: category }).exec();
  const user = req.user;

  // if (!designer) {
  //   return next(new ErrorHandler("Designer not found", 404));
  // }

  const appointments = await appointmentModel
    .find({ user: user._id }).exec();
    // .populate("designer");

  if (appointments && appointments.category === category) {
    return next(
      new ErrorHandler(
        `Your appointment is already scheduled on ${appointments.date} at ${appointments.time}.`
      )
    );
  }

  const appointment = new appointmentModel({
    user: user._id,
    // designer: designer._id,
    date,
    time,
    category,
  });

  user.appointments.push(appointment);
  await appointment.save();
  await user.save();

  res.status(201).json({ appointment });
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
    return next(new ErrorHandler("Invalid OTP", 404));
  } else {
    await otpModel.findOneAndDelete({ email: email }).catch((err) => {
      return next(new ErrorHandler(err.message, 500));
    });
  }

  /*
    // This helps in verifying otp sent on mobile number.
    let { mobileNumber, otp } = req.body;
    let response = await verifyOTP(mobileNumber, otp);
    if (response.status != "approved")
    return next(new ErrorHandler(response.message, response.status));
  */

  res.status(200).json("OTP Verified!");
});
