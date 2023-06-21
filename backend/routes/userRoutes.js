const express = require("express");
const router = express.Router();
const { isAdmin } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  blockUser,
} = require("../controllers/userController");

// Retrieve all users (accessible by admin)
router.get("/", authenticate, isAdmin, getAllUsers);

// Retrieve a user by ID
router.get("/:userId", authenticate, isAdmin, getUserById);

// Create a new user
router.post("/", createUser);

// Delete a user (accessible by admin)
router.delete("/:userId", authenticate, isAdmin, deleteUser);

// Block/Unblock a user (accessible by admin)
router.patch("/:userId/block", authenticate, isAdmin, blockUser);

module.exports = router;
