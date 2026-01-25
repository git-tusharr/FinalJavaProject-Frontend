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


import axios from "../api/axios";

/* ================= ADD TO WISHLIST ================= */
export const addToWishlist = (userId, productId) => {
  console.log("ADD TO WISHLIST:", { userId, productId });

  return axios.post("/api/wishlist/add", {
    userId,
    productId,
  });
};

/* ================= GET WISHLIST ================= */
export const getWishlist = (userId) => {
  console.log("GET WISHLIST FOR USER:", userId);

  return axios.get(`/api/wishlist/get/${userId}`);
};

/* ================= REMOVE FROM WISHLIST ================= */
export const removeFromWishlist = (userId, productId) => {
  console.log("REMOVE FROM WISHLIST:", { userId, productId });

  return axios.delete("/api/wishlist/remove", {
    params: { userId, productId },
  });
};
