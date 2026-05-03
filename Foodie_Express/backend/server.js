// server.js — Foodie Express Backend Entry Point
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// ─── Connect Database ──────────────────────────────────────────────────────────
connectDB();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded review images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/restaurants", require("./routes/restaurantRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// Health check
app.get("/", (req, res) =>
  res.json({ message: "🍕 Foodie Express API is running!", status: "OK" })
);

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));