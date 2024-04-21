const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsynchErrors } = require("./catchAsynchErrors");
const userModel = require("../models/userModel");

exports.isAuthenticated = catchAsynchErrors(async (req, res, next) => {
  const { token } = req.cookies;
  token && jwt.verify(token, process.env.JWT_SECRET);
  req.user = token
    ? await userModel.findById(jwt.decode(token).id).exec()
    : null;
  next(
    token
      ? null
      : new ErrorHandler("Please signin to access the resource.", 401)
  );
});
