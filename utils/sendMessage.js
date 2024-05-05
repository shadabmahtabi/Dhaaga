const ErrorHandler = require("./ErrorHandler");

const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

exports.sendOTP = async (mobileNumber) => {
  try {
    
    let response = await client.verify.v2
    .services("VAdc456edb4944350a4015fe997d258a99")
    .verifications.create({ to: mobileNumber, channel: "sms" });

    return response;

  } catch (error) {
    return error;
  }
};

exports.verifyOTP = async (mobileNumber, otp) => {
  try {
    let response = await client.verify.v2
      .services("VAdc456edb4944350a4015fe997d258a99")
      .verificationChecks.create({
        to: mobileNumber,
        code: otp,
      });

    return response;
  } catch (error) {
    return error;
  }
};
