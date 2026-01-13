// src/api/productImageApi.jsx
import axios from "axios";

const API_BASE = "http://localhost:8080/api"; // change if your backend URL is different

export const uploadImages = async ({ productId, variantId, files }) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  if (variantId) formData.append("variantId", variantId);

  const response = await axios.post(`${API_BASE}/products/${productId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
