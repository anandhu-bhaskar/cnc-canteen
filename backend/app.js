const express = require("express");
const mongoose = require("mongoose");
const passportConfig = require("./config/passport"); // Import passportConfig before passport
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

require("dotenv").config();

// Rest of your code
console.log(process.env.JWT_SECRET);
const cors = require("cors");

const Order = require("./models/orderSchema");
const User = require("./models/userSchema");
const Menu = require("./models/menuSchema");
const Review = require("./models/reviewSchema");
const Cart = require("./models/cartSchema");

const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const menuRoutes = require("./routes/menuRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");

dotenv.config(); // Load environment variables
const JWT_SECRET = process.env.JWT_SECRET;

const connectDB = require("./config/dbconfig");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Configure Passport
passportConfig(passport);

app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
connectDB();

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

app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/menu", menuRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to the authentication app!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
