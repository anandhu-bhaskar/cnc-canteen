const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { authenticate } = require("../middleware/authMiddleware");
const { isAdmin } = require("../controllers/authController");

// GET /menu
router.get("/", menuController.getMenuItems);

// GET /menu/:id
router.get("/:id", menuController.getMenuItemById);

// POST /menu
router.post("/", authenticate, isAdmin, menuController.createMenuItem);

// PUT /menu/:id
router.put("/:id", authenticate, isAdmin, menuController.updateMenuItem);

// DELETE /menu/:id
router.delete("/:id", authenticate, isAdmin, menuController.deleteMenuItem);

module.exports = router;
