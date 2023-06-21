const express = require("express");
const router = express.Router();
const { isAdmin } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

// Retrieve all orders
router.get("/", authenticate, getAllOrders);

// Retrieve an order by ID
router.get("/:orderId", authenticate, getOrderById);

// Create a new order
router.post("/", createOrder);

// Update order status
router.patch("/:orderId/status", authenticate, isAdmin, updateOrderStatus);

// Delete an order
router.delete("/:orderId", authenticate, isAdmin, deleteOrder);

module.exports = router;
