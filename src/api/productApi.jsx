// import axios from "axios";

// const API_BASE = "http://localhost:8080/api/products";

// export const createProduct = async (productData) => {
//   return axios.post(API_BASE, productData);
// };






// export const getProductBySlug = async (slug) => {
//   return axios.get(`${API_BASE}/${slug}`);
// };


import axios from "axios";

const API_BASE = "http://localhost:8080/api/products";

export const createProduct = async (productData) => {
  return axios.post(API_BASE, productData);
};






export const getProductBySlug = async (slug) => {
  return axios.get(`${API_BASE}/${slug}`);
};
