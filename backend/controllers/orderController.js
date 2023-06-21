// orderController.js

const Order = require("../models/orderSchema");

// Get all orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Get order by ID
const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// Create a new order
const createOrder = async (req, res, next) => {
  try {
    const { customerName, items } = req.body;

    // Validate request data
    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // Create a new order
    const newOrder = new Order({
      customerName,
      status: "pending",
      items,
      statusUpdates: [
        {
          status: "pending",
          timestamp: Date.now(),
          elapsed: 0,
        },
      ],
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    next(error);
  }
};

// Update order status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate request data
    if (!status) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order status and timestamps
    const currentTime = Date.now();
    const lastUpdate = order.statusUpdates[order.statusUpdates.length - 1];
    const elapsed = currentTime - lastUpdate.timestamp;

    order.status = status;
    order.statusUpdates.push({ status, timestamp: currentTime, elapsed });

    await order.save();

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    next(error);
  }
};

// Delete an order
const deleteOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.remove();

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
