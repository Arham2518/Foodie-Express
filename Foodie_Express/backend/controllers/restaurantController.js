// controllers/restaurantController.js
const Restaurant = require("../models/Restaurant");

// GET /api/restaurants — list all, supports ?type= and ?name= filters
exports.getAllRestaurants = async (req, res) => {
  try {
    const { type, name, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (name) filter.name = { $regex: name, $options: "i" };

    const restaurants = await Restaurant.find(filter)
      .select("-menu -reviews") // lean list view
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ rating: -1 });

    const total = await Restaurant.countDocuments(filter);
    res.json({ success: true, total, page: Number(page), data: restaurants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/restaurants/:id — single restaurant with full menu
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    res.json({ success: true, data: restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/restaurants — create new restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json({ success: true, data: restaurant });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/restaurants/:id — update restaurant info
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!restaurant)
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    res.json({ success: true, data: restaurant });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/restaurants/:id
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant)
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    res.json({ success: true, message: "Restaurant deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Menu Item Controllers ─────────────────────────────────────────────────────

// POST /api/restaurants/:id/menu — add menu item (simple, customizable, or combo)
exports.addMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ success: false, message: "Restaurant not found" });

    restaurant.menu.push(req.body);
    await restaurant.save();
    const added = restaurant.menu[restaurant.menu.length - 1];
    res.status(201).json({ success: true, data: added });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/restaurants/:id/menu/:itemId — update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ success: false, message: "Restaurant not found" });

    const item = restaurant.menu.id(req.params.itemId);
    if (!item)
      return res.status(404).json({ success: false, message: "Menu item not found" });

    Object.assign(item, req.body);
    await restaurant.save();
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/restaurants/:id/menu/:itemId
exports.deleteMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ success: false, message: "Restaurant not found" });

    restaurant.menu.pull({ _id: req.params.itemId });
    await restaurant.save();
    res.json({ success: true, message: "Menu item removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Review Controllers ────────────────────────────────────────────────────────

// POST /api/restaurants/:id/reviews — add a review (text + rating + optional image)
exports.addReview = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ success: false, message: "Restaurant not found" });

    const review = {
      customerName: req.body.customerName,
      rating: req.body.rating,
      comment: req.body.comment,
      image: req.file ? `/uploads/${req.file.filename}` : req.body.image,
    };

    restaurant.reviews.push(review);
    await restaurant.save(); // triggers rating recalculation
    res.status(201).json({
      success: true,
      rating: restaurant.rating,
      totalReviews: restaurant.totalReviews,
      review: restaurant.reviews[restaurant.reviews.length - 1],
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/restaurants/:id/reviews — get all reviews for a restaurant
exports.getReviews = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).select("reviews rating totalReviews name");
    if (!restaurant)
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    res.json({ success: true, data: restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};