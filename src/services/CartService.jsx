import axios from "axios";

const API = "http://localhost:8080/api/cart";

// 🔐 token helper
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const addToCart = (userId, payload) =>
  axios.post(`${API}/add/${userId}`, payload, authHeader());

export const getCart = (userId) =>
  axios.get(`${API}/get/${userId}`, authHeader());

export const decreaseItem = (cartItemId) =>
  axios.put(`${API}/decrease/${cartItemId}`, {}, authHeader());

export const clearCart = (userId) =>
  axios.delete(`${API}/clear/${userId}`, authHeader());

export const countCartItems = (userId) =>
  axios.get(`${API}/count/${userId}`, authHeader());


export const increaseItem = (cartItemId) =>
  axios.put(`${API}/increase/${cartItemId}`, {}, authHeader());


export const removeItem = (cartItemId) =>
  axios.delete(`${API}/remove/${cartItemId}`, authHeader());
