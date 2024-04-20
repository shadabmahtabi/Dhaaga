const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsynchErrors } = require("./catchAsynchErrors");
const userModel = require("../models/userModel");

exports.isAuthenticated = catchAsynchErrors(async (req, res, next) => {
  // let { token } = req.cookies;

  // if (!token) {
  //   return next(new ErrorHandler("Please signin to access the resource.", 401));
  // }

  // let { id } = jwt.verify(token, process.env.JWT_SECRET);

  // //   res.json({ id, token });
  //   req.user = await userModel.findById(id).exec();
  // next();

  // req.cookies.token
  //   ? jwt.verify(req.cookies.token, process.env.JWT_SECRET)
  //   : next(new ErrorHandler("Please signin to access the resource.", 401));
  // next();

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
