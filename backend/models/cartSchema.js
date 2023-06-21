const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  cart_id: {
    type: String,
    required: true,
  },
  num_items: {
    type: Number,
    default: 0,
  },
  cart_total: {
    type: Number,
    default: 0,
  },
  items: [
    {
      id: {
        type: Number,
        unique: false,
        required: false,
      },
      title: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      calories: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
