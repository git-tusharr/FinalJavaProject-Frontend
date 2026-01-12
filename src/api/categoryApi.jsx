// src/api/categoryApi.js
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/categories";

export const getCategoryBreadcrumb = (categoryId) => {
  return axios.get(`${BASE_URL}/breadcrumb/${categoryId}`);
};
