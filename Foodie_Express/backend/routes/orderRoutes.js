// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const oc = require("../controllers/orderController");

router.post("/", oc.placeOrder);
router.get("/", oc.getAllOrders);
router.get("/:id", oc.getOrderById);
router.patch("/:id/status", oc.updateOrderStatus);

module.exports = router;