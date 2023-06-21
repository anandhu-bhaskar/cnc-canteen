const Menu = require("../models/menuSchema");

// Get all menu items
exports.getMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ error: "Failed to get menu items" });
  }
};

// Get a single menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to get menu item" });
  }
};

// Create a new menu item
exports.createMenuItem = async (req, res) => {
  try {
    const { title, category, price, calories, image, type } = req.body;
    const menuItem = await Menu.create({
      title,
      category,
      price,
      calories,
      image,
      type,
    });
    res.status(201).json(menuItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to create menu item" });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const { title, category, price, calories, image, type } = req.body;
    const menuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      { title, category, price, calories, image, type },
      { new: true }
    );
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to update menu item" });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete menu item" });
  }
};
