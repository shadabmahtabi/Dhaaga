const ErrorHandler = require("./ErrorHandler");

exports.sendToken = async (user, otpFromDB, statusCode, res, next) => {
  try {
    let token = await user.getjwttoken();

    let options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      // secure: true
    };

    await otpFromDB.deleteOne();

    res.status(statusCode).cookie("token", token, options).json({
      succuss: true,
      id: user._id,
      token,
    });
  } catch (err) {
    return next(new ErrorHandler(`${err.message}`, 500));
  }
};
