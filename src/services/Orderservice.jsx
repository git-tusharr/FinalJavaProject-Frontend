import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // Update with your backend URL

// Create axios instance with auth headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Get all orders for a user
 */
export const getUserOrders = (userId) => {
  return api.get(`/auth/orders/user/${userId}`);
};

/**
 * Track order by order number
 */
export const trackOrder = (orderNumber) => {
  return api.get(`/auth/orders/${orderNumber}`);
};

/**
 * Cancel an order
 */
export const cancelOrder = (orderId) => {
  return api.put(`/auth/orders/${orderId}/cancel`);
};

/**
 * Request return for an order
 */
export const returnOrder = (orderId) => {
  return api.put(`/auth/orders/${orderId}/return`);
};

/**
 * Update order status (Admin only)
 */
export const updateOrderStatus = (orderId, status) => {
  return api.put(`/auth/orders/${orderId}/status`, { status });
};

export default {
  getUserOrders,
  trackOrder,
  cancelOrder,
  returnOrder,
  updateOrderStatus,
};