// import axios from "axios";

// const API_BASE = "http://localhost:8080/api/variants";

// // CREATE VARIANT (must return saved variant with ID)
// export const createVariant = async (productId, data) => {
//   const res = await axios.post(
//     `${API_BASE}/${productId}`,
//     data
//   );
//   return res.data; // ✅ must contain { id, sku, stock, ... }
// };

// // GET VARIANTS BY PRODUCT
// export const getVariants = async (productId) => {
//   const res = await axios.get(`${API_BASE}/${productId}`);
//   return res.data;
// };


import axios from "axios";

const API_BASE = "http://localhost:8080/api/variants";

// CREATE VARIANT (must return saved variant with ID)
export const createVariant = async (productId, data) => {
  const res = await axios.post(
    `${API_BASE}/${productId}`,
    data
  );
  return res.data; // ✅ must contain { id, sku, stock, ... }
};

// GET VARIANTS BY PRODUCT
export const getVariants = async (productId) => {
  const res = await axios.get(`${API_BASE}/${productId}`);
  return res.data;
};
