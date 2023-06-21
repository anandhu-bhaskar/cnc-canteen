const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  menuItemId: {
    type: Number,
    ref: "Menu",
  },
  reviewer: {
    type: String,
    required: true,
  },
  reviewer_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Review", reviewSchema, "reviews");
