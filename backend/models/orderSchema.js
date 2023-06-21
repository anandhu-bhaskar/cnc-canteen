const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerName: { type: String, required: true },
  status: { type: String, required: true },
  orderTotal: { type: Number, required: true },
  items: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      category: { type: String, required: true },
      price: { type: Number, required: true },
      calories: { type: String, required: true }, // Change to String if the values are "220 - 280 Kcal"
      image: { type: String, required: true }, // Change to String for storing image URLs
      type: { type: String, required: true },
    },
  ],
  payment: {
    paid: { type: Boolean, required: true },
    method: { type: String, required: true },
  },
  statusUpdates: [
    {
      status: { type: String, required: true },
      timestamp: { type: String, required: true },
      elapsed: { type: Number, required: true },
    },
  ],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
