// reviewController.js
const Review = require("../models/reviewSchema");
const Menu = require("../models/menuSchema");
const User = require("../models/userSchema");

exports.addReview = async (req, res) => {
  try {
    const { menuItemId, rating, reviewerName, comment } = req.body;

    // Check if the menu item exists
    const menuItem = await Menu.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Get the user information
    const userId = req.user._id; // Assuming the user is authenticated and user information is available in the request object
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has purchased the menu item
    const hasPurchased = user.orders.some((order) =>
      order.menuItemId.equals(menuItemId)
    );
    if (!hasPurchased) {
      return res.status(401).json({
        message: "You are not authorized to add a review for this menu item",
      });
    }

    // Create the review
    const review = new Review({
      menuItem: menuItemId,
      rating,
      reviewerName,
      comment,
    });

    // Save the review
    await review.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getReviewsByMenuId = async (req, res) => {
  try {
    const { menuId } = req.params;

    const reviews = await Review.find({ menuItem: menuId });
    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
