// // src/services/WishlistService.jsx
// import axios from "axios";

// const API = "http://localhost:8080/api/wishlist";

// // 🔐 Auth header helper
// const authHeader = () => ({
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// });

// // Add item to wishlist
// export const addToWishlist = (userId, productId) =>
//   axios.post(`${API}/add`, { userId, productId }, authHeader());

// // Get wishlist items for a user
// export const getWishlist = (userId) =>
//   axios.get(`${API}/get/${userId}`, authHeader());

// // Remove item from wishlist
// export const removeFromWishlist = (userId, productId) =>
//   axios.delete(`${API}/remove`, {
//     ...authHeader(),
//     params: { userId, productId },
//   });

// // Count wishlist items (optional, for badge)
// export const countWishlistItems = async (userId) => {
//   const res = await getWishlist(userId);
//   return res.data.length;
// };

import axios from "axios";

const API_URL = "http://localhost:8080/api/wishlist";

export const addToWishlist = async (data) => {
  const res = await axios.post(`${API_URL}/add`, data);
  return res.data;
};

export const getWishlist = async (userId) => {
  const res = await axios.get(`${API_URL}/get/${userId}`);
  return res.data;
};

export const removeFromWishlist = async (userId, productId) => {
  await axios.delete(`${API_URL}/remove`, {
    params: { userId, productId },
  });
};

// ✅ Used by UserMenu / badge count
export const countWishlistItems = async (userId) => {
  const res = await getWishlist(userId);
  return res.length;
};
