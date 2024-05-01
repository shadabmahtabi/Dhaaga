const express = require("express");
const {
  homepage,
  userSignUp,
  userSignIn,
  userSignOut,
  bookDesigner,
  verifyDesigner,
} = require("../controllers/indexController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

/**
 *  @method GET
 *  @route  /
 *  @access Public
 *  @desc   For showing Home Page
 */
router.get("/", isAuthenticated, homepage);

/**
 *  @method POST
 *  @route  /signup
 *  @access Public
 *  @desc   Route for handling user sign up request from the frontend.
 */
router.post("/signup", userSignUp);

/**
 * @method  POST
 * @route   /signin
 * @access  Public
 * @desc    For handling User Sign In Requests From The Front End.
 */
router.post("/signin", userSignIn);

/**
 * @method  GET
 * @route   /signout
 * @access  Private
 * @desc    For handling User Log Out Requests From The Front End.
 */
router.get("/signout", isAuthenticated, userSignOut);

/**
 * @method  POST
 * @route   /book-designer
 * @access  Private
 * @desc    For handling booking a designer.
 */
router.post("/book-designer", bookDesigner);

/**
 * @method  POST
 * @route   /verify/otp
 * @access  Private
 * @desc    For handling verification of OTP sent to mobile number.
 */
router.post("/verify/otp", verifyDesigner);

module.exports = router;
