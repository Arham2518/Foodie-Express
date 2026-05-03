// routes/restaurantRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const rc = require("../controllers/restaurantController");

// Multer config for review images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `review-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    cb(null, allowed.test(file.mimetype));
  },
});

// ─── Restaurant CRUD ───────────────────────────────────────────────────────────
router.get("/", rc.getAllRestaurants);
router.get("/:id", rc.getRestaurantById);
router.post("/", rc.createRestaurant);
router.put("/:id", rc.updateRestaurant);
router.delete("/:id", rc.deleteRestaurant);

// ─── Menu Item Routes ──────────────────────────────────────────────────────────
router.post("/:id/menu", rc.addMenuItem);
router.put("/:id/menu/:itemId", rc.updateMenuItem);
router.delete("/:id/menu/:itemId", rc.deleteMenuItem);

// ─── Review Routes ─────────────────────────────────────────────────────────────
router.get("/:id/reviews", rc.getReviews);
router.post("/:id/reviews", upload.single("image"), rc.addReview);

module.exports = router;