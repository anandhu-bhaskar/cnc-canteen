const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/userSchema");
const Cart = require("../models/cartSchema");
const { generateUniqueCartId } = require("../utils/cartUtils");

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  // Check if user is authenticated (e.g., using passport.js or JWT authentication)
  // For example, you can use passport.js to authenticate the user
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return next();
    });
  })(req, res, next);
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  // Check if user is an admin based on the user object attached to the request
  const user = req.user;
  if (user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
};

// User registration
const registerUser = async (req, res, next) => {
  try {
    const { username, password, email, contactNumber, role, name } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already registered. Please login." });
    }

    // Get the last user_id from the database
    const lastUser = await User.findOne({}, {}, { sort: { user_id: -1 } });
    let lastUserId = 0;
    if (lastUser) {
      lastUserId = parseInt(lastUser.user_id);
    }

    // Create a new user with an incremented user_id
    const newUser = new User({
      username,
      password: password,
      email,
      contactNumber,
      role,
      user_id: (lastUserId + 1).toString(),
      name,
    });
    await newUser.save();

    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      return res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    });
  } catch (error) {
    next(error);
  }
};

// User login
const loginUser = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    try {
      // Create or retrieve the cart for the user
      console.log("Login User - User:", user);

      let cart = await Cart.findOne({ user_id: user.user_id });
      console.log("Login User - Cart:", cart);

      if (!cart) {
        const cart_id = generateUniqueCartId();

        const newCart = new Cart({
          user_id: user.user_id,
          cart_id,
          num_items: 0,
          cart_total: 0,
          items: [],
        });

        await newCart.save();
        console.log("Login User - New Cart:", newCart);
      }

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({ message: "Login successful", user, cart });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

// User logout
const logoutUser = (req, res) => {
  req.logout();
  res.json({ message: "Logout successful" });
};

// Google sign-up/login
const googleSignUp = passport.authenticate("google-signup", {
  scope: ["profile", "email"],
});

const googleSignUpCallback = (req, res, next) => {
  passport.authenticate("google-signup", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: "Google signup successful", user });
    });
  })(req, res, next);
};

const googleLogin = passport.authenticate("google-login", {
  scope: ["profile", "email"],
});

const googleLoginCallback = (req, res, next) => {
  passport.authenticate("google-login", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: "Google login successful", user });
    });
  })(req, res, next);
};

// Facebook sign-up/login
const facebookSignUp = passport.authenticate("facebook-signup", {
  scope: ["email"],
});

const facebookSignUpCallback = (req, res, next) => {
  passport.authenticate("facebook-signup", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: "Facebook signup successful", user });
    });
  })(req, res, next);
};

const facebookLogin = passport.authenticate("facebook-login", {
  scope: ["email"],
});

const facebookLoginCallback = (req, res, next) => {
  passport.authenticate("facebook-login", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: "Facebook login successful", user });
    });
  })(req, res, next);
};

module.exports = {
  authenticate,
  isAdmin,
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
};
