// src/components/OrderForm.jsx
import React, { useState } from "react";
import { placeOrder } from "../services/api";

export default function OrderForm({ restaurant, cart, setCart }) {
  const [customer, setCustomer] = useState({ customerName: "", customerPhone: "", deliveryAddress: "", paymentMethod: "cash_on_delivery", notes: "" });
  const [placed, setPlaced] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const submitOrder = async () => {
    if (!customer.customerName || !customer.deliveryAddress) {
      return alert("Please fill in your name and address.");
    }
    setLoading(true);
    try {
      const orderPayload = {
        restaurantId: restaurant._id,
        ...customer,
        items: cart.map((item) => ({
          menuItemId: item._id,
          name: item.name,
          basePrice: item.price,
          quantity: item.quantity,
          selectedCustomizations: item.selectedCustomizations || [],
        })),
      };
      const res = await placeOrder(orderPayload);
      setPlaced(res.data.data);
      setCart([]);
    } catch (err) {
      alert("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (placed) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "green" }}>✅ Order Placed!</h2>
        <p>Order ID: <strong>{placed._id}</strong></p>
        <p>Total: <strong>Rs. {placed.totalAmount}</strong></p>
        <p>Status: <strong>{placed.status}</strong></p>
        <p>Payment: <strong>{placed.paymentMethod.replace("_", " ")}</strong></p>
        <button onClick={() => setPlaced(null)} style={{ marginTop: "16px", padding: "10px 24px", background: "#e63946", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Place Another Order
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3>Your Order</h3>
      {cart.length === 0 ? (
        <p style={{ color: "#888" }}>No items in cart. Go to Menu and add items.</p>
      ) : (
        <>
          {/* Cart Summary */}
          <div style={{ background: "#f9f9f9", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
            {cart.map((item) => (
              <div key={item._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span>{item.name} × {item.quantity}</span>
                <span>Rs. {item.price * item.quantity}</span>
              </div>
            ))}
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span><span>Rs. {totalAmount}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Delivery Fee</span><span>Rs. 50</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
              <span>Total</span><span>Rs. {totalAmount + 50}</span>
            </div>
          </div>

          {/* Customer Details */}
          <h3>Delivery Details</h3>
          {[
            { key: "customerName", label: "Full Name", placeholder: "Your name" },
            { key: "customerPhone", label: "Phone", placeholder: "+92-3XX-XXXXXXX" },
            { key: "deliveryAddress", label: "Delivery Address", placeholder: "House #, Street, Area, City" },
          ].map(({ key, label, placeholder }) => (
            <div key={key} style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>{label}</label>
              <input
                placeholder={placeholder}
                value={customer[key]}
                onChange={(e) => setCustomer({ ...customer, [key]: e.target.value })}
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
            </div>
          ))}

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Payment Method</label>
            <select
              value={customer.paymentMethod}
              onChange={(e) => setCustomer({ ...customer, paymentMethod: e.target.value })}
              style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
            >
              <option value="cash_on_delivery">Cash on Delivery</option>
              <option value="easypaisa">EasyPaisa</option>
              <option value="jazzcash">JazzCash</option>
              <option value="card">Card</option>
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Special Notes</label>
            <textarea
              placeholder="Any special instructions..."
              value={customer.notes}
              onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", minHeight: "60px" }}
            />
          </div>

          <button
            onClick={submitOrder}
            disabled={loading}
            style={{ width: "100%", padding: "14px", background: "#e63946", color: "#fff", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
          >
            {loading ? "Placing Order..." : `🛒 Place Order — Rs. ${totalAmount + 50}`}
          </button>
        </>
      )}
    </div>
  );
}
