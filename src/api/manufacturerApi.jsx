import axios from "axios";

const API_BASE = "http://localhost:8080/api/products/manufacturer-info";

export const saveManufacturerInfo = async (productId, content) => {
  const res = await axios.post(`${API_BASE}/${productId}`, content, {
    headers: { "Content-Type": "text/plain" }, // backend expects plain text
  });
  return res.data;
};

export const getManufacturerInfo = async (productId) => {
  const res = await axios.get(`${API_BASE}/${productId}`);
  return res.data;
};
