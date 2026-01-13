import axios from "axios";

const API_BASE = "http://localhost:8080/api/products";

export const saveSpecifications = async (productId, specs) => {
  const res = await axios.post(`${API_BASE}/${productId}/specs/bulk`, specs);
  return res.data;
};

export const getSpecifications = async (productId) => {
  const res = await axios.get(`${API_BASE}/${productId}/specs`);
  return res.data;
};
