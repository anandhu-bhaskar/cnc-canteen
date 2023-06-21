const Cart = require("../models/cartSchema");
const Order = require("../models/orderSchema");
const logger = require("../logger");
const mongoose = require("mongoose");

const { generateUniqueCartId } = require("../utils/cartUtils");

// Get cart by user ID
const getCartByUserId = async (req, res, next) => {
  console.log("getcart called");
  try {
    const { user_id } = req.params;

    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({ cart });
  } catch (error) {
    logger.error("Error retrieving cart", { error });
    next(error);
  }
};

// Create a new cart
const createCart = async (req, res, next) => {
  try {
    const { user_id } = req.body;

    // Generate a unique cart_id
    const cart_id = generateUniqueCartId();

    const newCart = new Cart({
      user_id,
      cart_id, // Include cart_id when creating a new Cart instance
      num_items: 0,
      cart_total: 0,
      items: [],
    });

    await newCart.save();

    res
      .status(201)
      .json({ message: "Cart created successfully", cart: newCart });
  } catch (error) {
    logger.error("Error creating cart", { error });
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { cart_id, user_id, item } = req.body;

    console.log("ITEEEEEEEEEEEEEEEEEEEEEEEEEEEM", item);
    // Assuming user ID is available in the req.user object

    let cart = await Cart.findOne({ cart_id });
    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({
        user_id,
        cart_id,
        num_items: 0,
        cart_total: 0,
        items: [],
      });
    }

    // Check if the item already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (cartItem) => cartItem.id === item.id // Update the identifier comparison here
    );

    if (existingItemIndex !== -1) {
      // Item already exists, increase the quantity
      cart.items[existingItemIndex].quantity += 1;
    } else {
      // Item does not exist, add it to the cart
      item.quantity = 1;
      cart.items.push(item);
    }

    // Update cart total and number of items
    cart.num_items = cart.items.length;
    cart.cart_total = cart.items.reduce(
      (total, cartItem) => total + cartItem.price,
      0
    );

    await cart.save();

    res.json({ message: "Item added to cart successfully", cart });
  } catch (error) {
    logger.error("Error adding item to cart", { error });
    next(error);
  }
};

// Remove item from cart
const removeFromCart = async (req, res, next) => {
  try {
    const { cart_id, item_id } = req.body;

    const cart = await Cart.findOne({ cart_id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the index of the item in the cart items array
    const itemIndex = cart.items.findIndex((item) => item.itemId === item_id);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove the item from the cart
    const removedItem = cart.items.splice(itemIndex, 1)[0];
    cart.num_items -= 1;
    cart.cart_total -= removedItem.price;

    await cart.save();

    res.json({ message: "Item removed from cart successfully", cart });
  } catch (error) {
    logger.error("Error removing item from cart", { error });
    next(error);
  }
};

const checkout = async (req, res, next) => {
  try {
    const { cart_id, paymentMethod } = req.body;

    const cart = await Cart.findOne({ cart_id });
    console.log("CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARTX", cart);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    function generateUniqueOrderId() {
      const timestamp = Date.now().toString(36);
      const randomNum = Math.random().toString(36).substr(2, 5);
      return `${timestamp}-${randomNum}`;
    }

    let method;
    if (paymentMethod === "1") {
      method = "paypal";
    } else if (paymentMethod === "2") {
      method = "cash-on-delivery";
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    console.log("Cart:", cart); // Log the value of the cart object

    const order = new Order({
      orderId: generateUniqueOrderId(),
      customerName: cart.user_id,
      status: "Pending Payment",
      orderTotal: cart.cart_total,
      items: cart.items,
      payment: {
        method: method, // Assign the 'method' property to the 'payment' object
        paid: false, // Set the initial 'paid' value to false
      },
      statusUpdates: [],
    });

    console.log("Orderrrrrrrrrrrr:", order); // Log the value of the order object

    await order.save();

    cart.items = [];
    cart.num_items = 0;
    cart.cart_total = 0;
    await cart.save();

    if (method === "paypal") {
      const approvalUrl = await createPayPalPayment(order);
      res.json({ approvalUrl });
    } else if (method === "cash-on-delivery") {
      res.json({
        message: "Order placed successfully",
        order: getOrderSummary(order),
      });
    }
  } catch (error) {
    logger.error("Error during checkout", { error });
    next(error);
  }
};

// Create a PayPal payment and retrieve the approval URL
const createPayPalPayment = async (order) => {
  // Implement the PayPal integration logic to create a payment and retrieve the approval URL
  // This involves making API calls to PayPal and handling the response
  // You can use a PayPal SDK or a custom implementation

  // Placeholder code to simulate PayPal payment creation
  const paymentId = "PAYMENT_ID";
  const approvalUrl = `https://www.paypal.com/approval?paymentId=${paymentId}`;

  return approvalUrl;
};

// Get a summary of the order
const getOrderSummary = (order) => {
  // Create a summary object with relevant order details
  const summary = {
    orderId: order.orderId,
    customerName: order.customerName,
    status: order.status,
    orderTotal: order.orderTotal,
    items: order.items,
    payment: {
      method: order.payment ? order.payment.method : "Unknown", // Handle the case when order.payment is undefined
      paid: order.payment ? order.payment.paid : false, // Handle the case when order.payment is undefined
    },
  };

  return summary;
};

module.exports = {
  getCartByUserId,
  createCart,
  addToCart,
  removeFromCart,
  checkout,
};
