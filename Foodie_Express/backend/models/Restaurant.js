// models/Restaurant.js
const mongoose = require("mongoose");

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

// Flexible topping/addon option (e.g. "Extra Cheese - Rs.50")
const OptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
  },
  { _id: false }
);

// A customizable group, e.g. "Choose Sauce" with multiple options
const CustomizationSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true }, // e.g. "Toppings", "Sauce"
    required: { type: Boolean, default: false },
    multiSelect: { type: Boolean, default: false },
    options: [OptionSchema],
  },
  { _id: false }
);

// Individual menu item — supports simple, customizable, or combo variants
const MenuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: String, default: "Main" }, // e.g. "Pizza", "Burger", "Combo"
    isAvailable: { type: Boolean, default: true },
    image: String, // URL or path

    // Optional: only present for customizable dishes
    customizations: [CustomizationSchema],

    // Optional: only present for combo items
    comboItems: [String], // e.g. ["Zinger Burger", "Medium Fries", "Pepsi"]

    // Flexible extras — catches any restaurant-specific irregular data
    extras: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Customer review — supports text, rating, and optional image
const ReviewSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    image: String, // optional review image URL
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Main Restaurant schema
const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["pizza", "burger", "desi", "bakery", "fast-food", "other"],
      default: "other",
    },
    address: { type: String, required: true },
    phone: String,
    email: String,
    isOpen: { type: Boolean, default: true },
    logo: String,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },

    // Flexible menu — each item can have its own shape
    menu: [MenuItemSchema],

    // Dynamic customer reviews
    reviews: [ReviewSchema],
  },
  { timestamps: true }
);

// Auto-update average rating before saving
RestaurantSchema.pre("save", function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.rating = parseFloat((total / this.reviews.length).toFixed(1));
    this.totalReviews = this.reviews.length;
  }
  next();
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);