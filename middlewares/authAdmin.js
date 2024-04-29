const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsynchErrors } = require("./catchAsynchErrors");
const adminModel = require("../models/adminModel");

exports.isAuthenticated = catchAsynchErrors(async (req, res, next) => {
  const { token } = req.cookies;
  token && jwt.verify(token, process.env.JWT_SECRET);
  req.user = token
    ? await adminModel.findById(jwt.decode(token).id).exec()
    : null;
  next(
    token
      ? null
      : new ErrorHandler("Please signin to access the resource.", 401)
  );
});
