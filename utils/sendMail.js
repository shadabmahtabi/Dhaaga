const nodemailer = require("nodemailer");
const ErrorHandler = require("./ErrorHandler");
const otpModel = require("../models/otpModel");

exports.sendmail = (req, res, next) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_EMAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let otp = Math.floor(1000 + Math.random() * 9000);

  const mailOptions = {
    from: "Dhaaga Enterprises",
    to: req.body.email,
    subject: "OTP Verification",
    html: `<h1>Your verification code is ${otp}.</h1>
            <h2>Do not share this anyone.</h2>
        `,
  };

  transport.sendMail(mailOptions, async (err, info) => {
    if (err) return next(new ErrorHandler(err.message, 500));

    let response = await otpModel({
      email: req.body.email,
      otp: otp,
    }).save();

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      id: response._id,
      info: info,
    });
  });
};
