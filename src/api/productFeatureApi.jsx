// import axios from "axios";

// const API_BASE = "http://localhost:8080/api/products";

// export const saveProductFeatures = async (productId, features) => {
//   // features = array of strings
//   const res = await axios.post(`${API_BASE}/${productId}/features/bulk`, features);
//   return res.data;
// };

// export const getProductFeatures = async (productId) => {
//   const res = await axios.get(`${API_BASE}/${productId}/features`);
//   return res.data;
// };
import axios from "axios";

const API_BASE = "http://localhost:8080/api/products";

export const saveProductFeatures = async (productId, features) => {
  // features = array of strings
  const res = await axios.post(`${API_BASE}/${productId}/features/bulk`, features);
  return res.data;
};

export const getProductFeatures = async (productId) => {
  const res = await axios.get(`${API_BASE}/${productId}/features`);
  return res.data;
};
