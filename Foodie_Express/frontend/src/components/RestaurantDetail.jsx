// src/components/RestaurantDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantById, addReview } from "../services/api";
import OrderForm from "./OrderForm";

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("menu");
  const [review, setReview] = useState({ customerName: "", rating: 5, comment: "" });
  const [reviewFile, setReviewFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const res = await getRestaurantById(id);
      setRestaurant(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((c) => c._id === item._id);
      if (exists) return prev.map((c) => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...item, quantity: 1, selectedCustomizations: [] }];
    });
  };

  const submitReview = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(review).forEach(([k, v]) => fd.append(k, v));
      if (reviewFile) fd.append("image", reviewFile);
      await addReview(id, fd);
      setReview({ customerName: "", rating: 5, comment: "" });
      setReviewFile(null);
      fetchRestaurant();
      alert("Review submitted!");
    } catch (err) {
      alert("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!restaurant) return <p style={{ padding: 20 }}>Restaurant not found.</p>;

  const categories = [...new Set(restaurant.menu.map((m) => m.category))];

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ borderBottom: "2px solid #e63946", paddingBottom: "16px", marginBottom: "16px" }}>
        <h2>{restaurant.name}</h2>
        <p style={{ color: "#555" }}>{restaurant.address} · {restaurant.phone}</p>
        <span>⭐ {restaurant.rating} ({restaurant.totalReviews} reviews)</span>
        {" · "}
        <span style={{ color: restaurant.isOpen ? "green" : "red" }}>
          {restaurant.isOpen ? "🟢 Open Now" : "🔴 Closed"}
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["menu", "reviews", "order"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 20px", border: "none", borderRadius: "20px", cursor: "pointer",
              background: activeTab === tab ? "#e63946" : "#f1f1f1",
              color: activeTab === tab ? "#fff" : "#333",
            }}
          >
            {tab === "menu" ? "📋 Menu" : tab === "reviews" ? "⭐ Reviews" : "🛒 Order"}
          </button>
        ))}
      </div>

      {/* MENU TAB */}
      {activeTab === "menu" && (
        <div>
          {categories.map((cat) => (
            <div key={cat}>
              <h3 style={{ borderLeft: "4px solid #e63946", paddingLeft: "10px" }}>{cat}</h3>
              {restaurant.menu
                .filter((m) => m.category === cat)
                .map((item) => (
                  <div
                    key={item._id}
                    style={{ border: "1px solid #eee", borderRadius: "8px", padding: "14px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
                  >
                    <div style={{ flex: 1 }}>
                      <strong>{item.name}</strong>
                      {item.description && <p style={{ color: "#666", margin: "4px 0", fontSize: "14px" }}>{item.description}</p>}

                      {/* Combo items */}
                      {item.comboItems && item.comboItems.length > 0 && (
                        <p style={{ fontSize: "13px", color: "#457b9d" }}>
                          Includes: {item.comboItems.join(", ")}
                        </p>
                      )}

                      {/* Customizations preview */}
                      {item.customizations && item.customizations.length > 0 && (
                        <div style={{ fontSize: "13px", color: "#888", marginTop: "6px" }}>
                          {item.customizations.map((c) => (
                            <span key={c.groupName} style={{ marginRight: "8px", background: "#f0f0f0", padding: "2px 8px", borderRadius: "10px" }}>
                              ⚙️ {c.groupName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong style={{ color: "#e63946", display: "block" }}>Rs. {item.price}</strong>
                      <button
                        onClick={() => addToCart(item)}
                        style={{ marginTop: "8px", padding: "6px 14px", background: "#e63946", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ))}
          {cart.length > 0 && (
            <div style={{ position: "fixed", bottom: 20, right: 20, background: "#e63946", color: "#fff", padding: "12px 20px", borderRadius: "8px", cursor: "pointer" }}
              onClick={() => setActiveTab("order")}>
              🛒 {cart.length} items · Go to Order
            </div>
          )}
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === "reviews" && (
        <div>
          {restaurant.reviews.length === 0 && <p>No reviews yet. Be the first!</p>}
          {restaurant.reviews.map((r) => (
            <div key={r._id} style={{ borderBottom: "1px solid #eee", paddingBottom: "12px", marginBottom: "12px" }}>
              <strong>{r.customerName}</strong>
              <span style={{ marginLeft: "10px", color: "#f4a261" }}>{"⭐".repeat(r.rating)}</span>
              <p style={{ color: "#555", margin: "4px 0" }}>{r.comment}</p>
              {r.image && <img src={r.image} alt="review" style={{ maxWidth: "120px", borderRadius: "6px" }} />}
              <small style={{ color: "#aaa" }}>{new Date(r.createdAt).toLocaleDateString()}</small>
            </div>
          ))}

          {/* Add Review Form */}
          <h3>Leave a Review</h3>
          <input placeholder="Your name" value={review.customerName} onChange={(e) => setReview({ ...review, customerName: e.target.value })}
            style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }} />
          <select value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
            style={{ padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"⭐".repeat(n)} ({n})</option>)}
          </select>
          <textarea placeholder="Write your review..." value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })}
            style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px", minHeight: "80px" }} />
          <input type="file" accept="image/*" onChange={(e) => setReviewFile(e.target.files[0])} style={{ marginBottom: "10px" }} />
          <button onClick={submitReview} disabled={submitting}
            style={{ padding: "10px 24px", background: "#e63946", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* ORDER TAB */}
      {activeTab === "order" && (
        <OrderForm restaurant={restaurant} cart={cart} setCart={setCart} />
      )}
    </div>
  );
}
