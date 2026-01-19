import axios from "axios";

const API_BASE = "http://localhost:8080/auth/checkout";

export const checkoutUser = (userId) => {
  return axios.post(`${API_BASE}/${userId}`);
};

export const getUserOrders = (userId) => {
  return axios.get(`${API_BASE}/${userId}`);
};
