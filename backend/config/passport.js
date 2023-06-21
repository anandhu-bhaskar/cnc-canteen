const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const dotenv = require("dotenv");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

// Local strategy for email/password login
passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        // Find the user by email
        const user = await User.findOne({ email });

        // If the user is not found, return an error message
        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Compare the provided password with the stored password
        if (password === user.password) {
          // If the passwords match, return the user
          return done(null, user);
        } else {
          // If the passwords don't match, return an error message
          return done(null, false, { message: "Invalid email or password" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

// JWT strategy for token authentication
passport.use(
  new JwtStrategy(
    {
      secretOrKey: JWT_SECRET,
      jwtFromRequest: (req) => req.cookies.jwt,
    },
    async (token, done) => {
      try {
        // Find the user using the token's userID
        const user = await User.findById(token.userId);

        // If the user is not found, return an error
        if (!user) {
          return done(null, false);
        }

        // If the user is found, return the user
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
// Google sign-up strategy
passport.use(
  "google-signup",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/signup/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        // If a user with the same email already exists, return an error message
        if (existingUser) {
          return done(null, false, {
            message: "Email already registered. Please login.",
          });
        }

        // Create a new user with the Google profile information
        const newUser = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          // Set other properties as required
        });

        // Save the new user
        await newUser.save();

        // Return the new user
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google login strategy
passport.use(
  "google-login",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/login/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find the user by email
        const user = await User.findOne({ email: profile.emails[0].value });

        // If the user is not found, return an error message
        if (!user) {
          return done(null, false, {
            message: "No account found. Please sign up.",
          });
        }

        // Return the user
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Facebook sign-up strategy
passport.use(
  "facebook-signup",
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/signup/callback",
      profileFields: ["id", "displayName", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        // If a user with the same email already exists, return an error message
        if (existingUser) {
          return done(null, false, {
            message: "Email already registered. Please login.",
          });
        }

        // Create a new user with the Facebook profile information
        const newUser = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          // Set other properties as required
        });

        // Save the new user
        await newUser.save();

        // Return the new user
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Facebook login strategy
passport.use(
  "facebook-login",
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/login/callback",
      profileFields: ["id", "displayName", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find the user by email
        const user = await User.findOne({ email: profile.emails[0].value });

        // If the user is not found, return an error message
        if (!user) {
          return done(null, false, {
            message: "No account found. Please sign up.",
          });
        }

        // Return the user
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = (passport) => {
  // Function to configure Passport
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
