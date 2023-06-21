const express = require("express");
const passport = require("passport");
const {
  registerUser,
  loginUser,
  logoutUser,
  googleSignUp,
  googleSignUpCallback,
  googleLogin,
  googleLoginCallback,
  facebookSignUp,
  facebookSignUpCallback,
  facebookLogin,
  facebookLoginCallback,
} = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

router.get("/google/signup", googleSignUp);
router.get("/google/signup/callback", googleSignUpCallback);
router.get("/google/login", googleLogin);
router.get("/google/login/callback", googleLoginCallback);

router.get("/facebook/signup", facebookSignUp);
router.get("/facebook/signup/callback", facebookSignUpCallback);
router.get("/facebook/login", facebookLogin);
router.get("/facebook/login/callback", facebookLoginCallback);

module.exports = router;
