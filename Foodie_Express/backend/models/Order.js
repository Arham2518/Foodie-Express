// models/Order.js
const mongoose = require("mongoose");

// Each item in the order captures chosen customizations at time of order
const OrderItemSchema = new mongoose.Schema(
  {
    menuItemId: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    basePrice: { type: Number, required: true },
    quantity: { type: Number, default: 1 },

    // Snapshot of chosen customizations (e.g. extra cheese +50)
    selectedCustomizations: [
      {
        groupName: String,
        chosen: [{ name: String, price: Number }],
      },
    ],
    itemTotal: Number, // basePrice + addons, × quantity
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    restaurantName: String,
    customerName: { type: String, required: true },
    customerPhone: String,
    deliveryAddress: { type: String, required: true },
    items: [OrderItemSchema],
    subtotal: Number,
    deliveryFee: { type: Number, default: 50 },
    totalAmount: Number,
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "card", "easypaisa", "jazzcash"],
      default: "cash_on_delivery",
    },
    notes: String,
  },
  { timestamps: true }
);

// Compute totals before saving
OrderSchema.pre("save", function (next) {
  this.items.forEach((item) => {
    const addonTotal = item.selectedCustomizations.reduce(
      (sum, g) => sum + g.chosen.reduce((s, c) => s + c.price, 0),
      0
    );
    item.itemTotal = (item.basePrice + addonTotal) * item.quantity;
  });
  this.subtotal = this.items.reduce((s, i) => s + i.itemTotal, 0);
  this.totalAmount = this.subtotal + this.deliveryFee;
  next();
});

module.exports = mongoose.model("Order", OrderSchema);