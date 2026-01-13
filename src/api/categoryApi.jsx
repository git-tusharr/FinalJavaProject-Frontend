// src/api/categoryApi.jsx
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/categories";

// Get all root categories (parentId = null)
export const getRootCategories = () => {
  return axios.get(BASE_URL);
};

// Get child categories of a parent
export const getSubCategories = (parentId) => {
  return axios.get(BASE_URL, { params: { parentId } });
};

// Get full breadcrumb for a category
export const getCategoryBreadcrumb = (categoryId) => {
  return axios.get(`${BASE_URL}/breadcrumb/${categoryId}`);
};
