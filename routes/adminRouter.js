const express = require("express");
const {
  homepage,
  adminSignUp,
  adminSignIn,
  adminSignOut,
} = require("../controllers/adminController");
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
 *  @desc   Route for handling Seller sign up request from the frontend.
 */
router.post("/signup", adminSignUp);

/**
 * @method  POST
 * @route   /signin
 * @access  Public
 * @desc    For handling Seller Sign In Requests From The Front End.
 */
router.post("/signin", adminSignIn);

/**
 * @method  GET
 * @route   /signout
 * @access  Private
 * @desc    For handling Seller Log Out Requests From The Front End.
 */
router.get("/signout", isAuthenticated, adminSignOut);

module.exports = router;
