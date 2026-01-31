import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUserOrders = (userId) =>
  api.get(`/auth/orders/user/${userId}`);

export const trackOrder = (orderNumber) =>
  api.get(`/auth/orders/${orderNumber}`);

export const cancelOrder = (orderId) =>
  api.put(`/auth/orders/${orderId}/cancel`);

export const returnOrder = (orderId) =>
  api.put(`/auth/orders/${orderId}/return`);

export const updateOrderStatus = (orderId, status) =>
  api.put(`/auth/orders/${orderId}/status`, { status });
