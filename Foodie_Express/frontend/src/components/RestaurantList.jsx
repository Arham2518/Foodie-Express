// src/components/RestaurantList.jsx
import React, { useEffect, useState } from "react";
import { getRestaurants } from "../services/api";
import { Link } from "react-router-dom";

const TYPE_LABELS = {
  pizza: "🍕 Pizza",
  burger: "🍔 Burger",
  desi: "🍛 Desi",
  bakery: "🎂 Bakery",
  "fast-food": "🌮 Fast Food",
  other: "🍽 Other",
};

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: "", name: "" });

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await getRestaurants(filter);
      setRestaurants(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🍽 Foodie Express — Restaurants</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Search by name..."
          value={filter.name}
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "200px" }}
        />
        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="">All Types</option>
          {Object.keys(TYPE_LABELS).map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <button
          onClick={fetchRestaurants}
          style={{ padding: "8px 16px", background: "#e63946", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading restaurants...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {restaurants.map((r) => (
            <div
              key={r._id}
              style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
            >
              <h3 style={{ margin: "0 0 6px" }}>{r.name}</h3>
              <span style={{ background: "#f1faee", padding: "2px 8px", borderRadius: "12px", fontSize: "12px" }}>
                {TYPE_LABELS[r.type] || r.type}
              </span>
              <p style={{ margin: "8px 0", color: "#555", fontSize: "14px" }}>{r.address}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>⭐ {r.rating} ({r.totalReviews} reviews)</span>
                <span style={{ color: r.isOpen ? "green" : "red", fontWeight: "bold" }}>
                  {r.isOpen ? "Open" : "Closed"}
                </span>
              </div>
              <Link
                to={`/restaurants/${r._id}`}
                style={{ display: "block", marginTop: "12px", textAlign: "center", background: "#e63946", color: "#fff", padding: "8px", borderRadius: "4px", textDecoration: "none" }}
              >
                View Menu
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
