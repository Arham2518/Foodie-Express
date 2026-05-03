// controllers/orderController.js
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");

// POST /api/orders — place a new order
exports.placeOrder = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant)
      return res.status(404).json({ success: false, message: "Restaurant not found" });

    const order = new Order({
      ...req.body,
      restaurantName: restaurant.name,
    });
    await order.save();
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/orders — list all orders (admin) or filter by customer
exports.getAllOrders = async (req, res) => {
  try {
    const { status, restaurantId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (restaurantId) filter.restaurantId = restaurantId;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, total: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/orders/:id/status — update delivery status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};