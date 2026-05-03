// src/services/api.js
import axios from "axios";

const BASE = "/api";

// ─── Restaurants ───────────────────────────────────────────────────────────────
export const getRestaurants = (params) =>
  axios.get(`${BASE}/restaurants`, { params });

export const getRestaurantById = (id) =>
  axios.get(`${BASE}/restaurants/${id}`);

export const createRestaurant = (data) =>
  axios.post(`${BASE}/restaurants`, data);

export const updateRestaurant = (id, data) =>
  axios.put(`${BASE}/restaurants/${id}`, data);

export const deleteRestaurant = (id) =>
  axios.delete(`${BASE}/restaurants/${id}`);

// ─── Menu Items ────────────────────────────────────────────────────────────────
export const addMenuItem = (restaurantId, item) =>
  axios.post(`${BASE}/restaurants/${restaurantId}/menu`, item);

export const updateMenuItem = (restaurantId, itemId, data) =>
  axios.put(`${BASE}/restaurants/${restaurantId}/menu/${itemId}`, data);

export const deleteMenuItem = (restaurantId, itemId) =>
  axios.delete(`${BASE}/restaurants/${restaurantId}/menu/${itemId}`);

// ─── Reviews ───────────────────────────────────────────────────────────────────
export const getReviews = (restaurantId) =>
  axios.get(`${BASE}/restaurants/${restaurantId}/reviews`);

export const addReview = (restaurantId, formData) =>
  axios.post(`${BASE}/restaurants/${restaurantId}/reviews`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ─── Orders ───────────────────────────────────────────────────────────────────
export const placeOrder = (order) =>
  axios.post(`${BASE}/orders`, order);

export const getOrders = (params) =>
  axios.get(`${BASE}/orders`, { params });

export const getOrderById = (id) =>
  axios.get(`${BASE}/orders/${id}`);

export const updateOrderStatus = (id, status) =>
  axios.patch(`${BASE}/orders/${id}/status`, { status });