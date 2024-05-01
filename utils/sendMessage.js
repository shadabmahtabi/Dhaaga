const ErrorHandler = require("./ErrorHandler");

const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

exports.sendOTP = async (req, res, next) => {
  let response = await client.verify.v2
    .services("VAdc456edb4944350a4015fe997d258a99")
    .verifications.create({ to: req.body.mobileNumber, channel: "sms" });

  if (!response) return next(new ErrorHandler("Error sending SMS", 500));

  res.status(201).json(response);
};

exports.verifyOTP = async (req, res, next) => {
  let response = await client.verify.v2
    .services("VAdc456edb4944350a4015fe997d258a99")
    .verificationChecks.create({
      to: req.body.mobileNumber,
      code: req.body.otp,
    });

  if (!response) return next(new ErrorHandler("Error verifying otp", 500));

  res.status(200).json(response);
};
