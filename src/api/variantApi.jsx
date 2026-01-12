import axios from "axios";

const API_BASE = "http://localhost:8080/api/variants";

export const createVariant = async (productId, data) => {
  const res = await axios.post(`${API_BASE}/${productId}`, data);
  return res.data;
};

export const getVariants = async (productId) => {
  const res = await axios.get(`${API_BASE}/${productId}`);
  return res.data;
};
