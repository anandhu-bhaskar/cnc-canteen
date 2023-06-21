const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.get("/:user_id", cartController.getCartByUserId);
router.post("/", cartController.createCart);
router.put("/", cartController.addToCart); // Make sure the callback function is defined for the put route
router.delete("/", cartController.removeFromCart);
// Checkout and initiate payment
router.post("/checkout", cartController.checkout);

module.exports = router;
