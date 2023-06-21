const passport = require("passport");

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

module.exports = {
  authenticate,
};
