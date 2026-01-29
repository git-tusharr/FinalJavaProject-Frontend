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
 * Create a Razorpay order for one-time payment
 */
export const createPaymentOrder = (data) => {
  return api.post("/auth/payment/create-order", data);
};

/**
 * Create a Razorpay subscription
 */
export const createSubscription = (data) => {
  return api.post("/auth/payment/create-subscription", data);
};

/**
 * Get payment order status
 */
export const getOrderStatus = (orderId) => {
  return api.get(`/auth/payment/status/order/${orderId}`);
};

/**
 * Get subscription status
 */
export const getSubscriptionStatus = (subId) => {
  return api.get(`/auth/payment/status/subscription/${subId}`);
};

export default {
  createPaymentOrder,
  createSubscription,
  getOrderStatus,
  getSubscriptionStatus,
};