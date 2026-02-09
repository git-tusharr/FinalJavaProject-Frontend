import { createContext, useState, useContext, useEffect } from "react";
import API from "../api/axiosInstance";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const loadCartCount = async () => {
    const uid = localStorage.getItem("userId"); // 👈 always current
    if (!uid) return;
    try {
      const res = await API.get(`/cart/count?userId=${uid}`);
      setCartCount(res.data);
    } catch {
      console.error("Failed to fetch cart count");
    }
  };

  useEffect(() => {
    loadCartCount();
  }, []); // initial load

  return (
    <CartContext.Provider value={{ cartCount, loadCartCount }}>
      {children}
    </CartContext.Provider>
  );
}
