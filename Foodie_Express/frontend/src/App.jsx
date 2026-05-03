// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RestaurantList from "./components/RestaurantList";
import RestaurantDetail from "./components/RestaurantDetail";

function App() {
  return (
    <Router>
      {/* Navbar */}
      <nav style={{ background: "#e63946", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontSize: "22px", fontWeight: "bold" }}>
          🍕 Foodie Express
        </Link>
        <span style={{ color: "#fff", fontSize: "14px" }}>Fast · Fresh · Delivered</span>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<RestaurantList />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
      </Routes>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "20px", color: "#888", marginTop: "40px", borderTop: "1px solid #eee" }}>
        © 2024 Foodie Express · MERN Stack Lab Project
      </footer>
    </Router>
  );
}

export default App;
