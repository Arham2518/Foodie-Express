// config/seed.js — Seeds the DB with realistic, irregular restaurant data
require("dotenv").config();
const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");
const connectDB = require("./db");

const seedData = [
  // ── 1. Pizza Joint (customizable items with toppings) ────────────────────────
  {
    name: "Pizza Palace",
    type: "pizza",
    address: "Main Boulevard, Lahore",
    phone: "042-1234567",
    isOpen: true,
    menu: [
      {
        name: "Margherita Pizza",
        description: "Classic tomato sauce with mozzarella",
        price: 799,
        category: "Pizza",
        customizations: [
          {
            groupName: "Size",
            required: true,
            multiSelect: false,
            options: [
              { name: "Small (8\")", price: 0 },
              { name: "Medium (10\")", price: 200 },
              { name: "Large (12\")", price: 400 },
            ],
          },
          {
            groupName: "Extra Toppings",
            required: false,
            multiSelect: true,
            options: [
              { name: "Extra Cheese", price: 100 },
              { name: "Mushrooms", price: 80 },
              { name: "Bell Peppers", price: 60 },
              { name: "Olives", price: 70 },
            ],
          },
        ],
      },
      {
        name: "BBQ Chicken Pizza",
        description: "Smoky BBQ sauce with grilled chicken",
        price: 999,
        category: "Pizza",
        customizations: [
          {
            groupName: "Size",
            required: true,
            multiSelect: false,
            options: [
              { name: "Medium (10\")", price: 0 },
              { name: "Large (12\")", price: 300 },
              { name: "XL (14\")", price: 600 },
            ],
          },
          {
            groupName: "Crust Type",
            required: false,
            multiSelect: false,
            options: [
              { name: "Thin Crust", price: 0 },
              { name: "Stuffed Crust", price: 150 },
            ],
          },
        ],
        extras: { glutenFreeOption: true, spicyLevel: ["mild", "medium", "hot"] },
      },
    ],
    reviews: [
      { customerName: "Ali", rating: 5, comment: "Best pizza in Lahore!" },
      { customerName: "Sara", rating: 4, comment: "Loved the stuffed crust." },
    ],
  },

  // ── 2. Burger Shop (simple items, no customization) ──────────────────────────
  {
    name: "Burger Barn",
    type: "burger",
    address: "DHA Phase 5, Karachi",
    phone: "021-9876543",
    isOpen: true,
    menu: [
      { name: "Classic Beef Burger", description: "100% beef patty", price: 450, category: "Burger" },
      { name: "Crispy Chicken Burger", description: "Fried chicken fillet", price: 380, category: "Burger" },
      { name: "Double Smash Burger", description: "Two smashed patties, special sauce", price: 650, category: "Burger" },
      {
        name: "Loaded Fries",
        description: "Fries with cheese sauce and jalapeños",
        price: 320,
        category: "Sides",
        extras: { allergens: ["dairy"], servingSize: "regular" },
      },
      { name: "Chocolate Shake", description: "Thick homemade shake", price: 250, category: "Drinks" },
    ],
    reviews: [
      { customerName: "Usman", rating: 4, comment: "Smash burger was fire 🔥" },
      { customerName: "Hina", rating: 3, comment: "Fries were a bit cold." },
    ],
  },

  // ── 3. Desi Food Corner (combos + extras) ────────────────────────────────────
  {
    name: "Desi Dhaba",
    type: "desi",
    address: "G-10 Markaz, Islamabad",
    phone: "051-5556789",
    isOpen: true,
    menu: [
      {
        name: "Daal Chawal Combo",
        description: "Yellow daal with steamed rice and raita",
        price: 350,
        category: "Combo",
        comboItems: ["Daal Makhni", "Steamed Rice", "Raita", "Salad"],
      },
      {
        name: "Karahi Combo (2 pax)",
        description: "Chicken karahi with 4 naan and drinks",
        price: 1200,
        category: "Combo",
        comboItems: ["Chicken Karahi (750g)", "4x Naan", "2x Soft Drinks", "Salad"],
        extras: { servingFor: 2, estimatedPrepTime: "25 mins" },
      },
      {
        name: "Biryani",
        description: "Aromatic chicken biryani",
        price: 280,
        category: "Main",
        customizations: [
          {
            groupName: "Portion",
            required: true,
            multiSelect: false,
            options: [
              { name: "Half Plate", price: 0 },
              { name: "Full Plate", price: 130 },
            ],
          },
        ],
      },
      {
        name: "Seekh Kabab Platter",
        description: "4 seekh kababs with chutney",
        price: 480,
        category: "Starters",
        customizations: [
          {
            groupName: "Spice Level",
            required: false,
            multiSelect: false,
            options: [
              { name: "Mild", price: 0 },
              { name: "Medium", price: 0 },
              { name: "Extra Hot", price: 0 },
            ],
          },
        ],
        extras: { halal: true, homemade: true },
      },
    ],
    reviews: [
      { customerName: "Kamran", rating: 5, comment: "Daal chawal reminds me of home." },
    ],
  },

  // ── 4. Bakery (simple menu, minimal fields) ───────────────────────────────────
  {
    name: "Sweet Crumbs Bakery",
    type: "bakery",
    address: "Johar Town, Lahore",
    isOpen: true,
    menu: [
      { name: "Croissant", price: 180, category: "Pastries" },
      { name: "Chocolate Cake Slice", price: 250, category: "Cakes" },
      { name: "Red Velvet Cupcake", price: 220, category: "Cakes" },
      { name: "Blueberry Muffin", price: 190, category: "Pastries" },
      { name: "Sourdough Bread (Loaf)", price: 480, category: "Breads" },
      { name: "Cinnamon Roll", price: 200, category: "Pastries" },
    ],
    reviews: [
      { customerName: "Fatima", rating: 5, comment: "The red velvet is divine!" },
      { customerName: "Zara", rating: 4, comment: "Loved the sourdough." },
      { customerName: "Omar", rating: 5, comment: "Best bakery in Johar Town." },
    ],
  },
];

const seed = async () => {
  await connectDB();
  await Restaurant.deleteMany({});
  const inserted = await Restaurant.insertMany(seedData);
  console.log(`✅ Seeded ${inserted.length} restaurants successfully.`);
  inserted.forEach((r) => console.log(`   → ${r.name} (${r._id})`));
  mongoose.connection.close();
};

seed();