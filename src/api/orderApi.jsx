import API from "./axiosInstance";

// USER: track order
export const trackOrder = async (orderNumber) => {
  const res = await API.get(`/orders/${orderNumber}`);
  return res.data;
};

// USER: order history
export const getMyOrders = async () => {
  const userId = localStorage.getItem("userId");
  const res = await API.get(`/orders/user/${userId}`);
  return res.data;
};

// ADMIN: update order status
export const updateOrderStatus = async (orderId, status) => {
  await API.put(`/orders/${orderId}/status`, { status });
};
