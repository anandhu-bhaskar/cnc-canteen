const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const logger = require("../logger");
const User = require("../models/userSchema");
const Order = require("../models/orderSchema");
const Menu = require("../models/menuSchema");
const Review = require("../models/reviewSchema");
const users = require("./accounts");
const orders = require("./orders");
const menu = require("./menu");
const generateReviews = require("./reviews");

// Resolve the absolute path to the .env file
const envPath = path.resolve(__dirname, "../.env");

// Load environment variables from the .env file
dotenv.config({ path: envPath });

// Example usage of logger
logger.info("Seeding started...");

// MongoDB connection string
const connectionString = process.env.MONGO_URI;
console.log(process.env.MONGO_URI);

// Function to connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

// Function to seed the menu
const seedMenu = async () => {
  try {
    await Menu.deleteMany();
    await Menu.create(menu);
    logger.info("Menu seeded successfully!");
  } catch (error) {
    logger.error("Error seeding menu:", error);
  }
};

// Function to seed users
const seedUsers = async () => {
  try {
    await User.deleteMany();
    await User.create(users);
    logger.info("Users seeded successfully!");
  } catch (error) {
    logger.error("Error seeding users:", error);
  }
};

// Function to seed orders
const seedOrders = async () => {
  try {
    await Order.deleteMany();
    await Order.create(orders);
    logger.info("Orders seeded successfully!");
  } catch (error) {
    logger.error("Error seeding orders:", error);
  }
};

// Function to seed reviews
const seedReviews = async () => {
  try {
    await Review.deleteMany();
    const generatedReviews = await generateReviews();
    await Review.insertMany(generatedReviews);
    logger.info("Reviews seeded successfully!");
  } catch (error) {
    logger.error("Error seeding reviews:", error);
  }
};

// Function to seed data
const seedData = async () => {
  await connectToMongoDB();
  await seedUsers();
  await seedMenu();
  await seedOrders();
  await seedReviews();
  mongoose.disconnect();
  logger.info("Seeding completed");
};

// Call the seedData function to start seeding
seedData();
