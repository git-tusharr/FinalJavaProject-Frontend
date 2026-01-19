import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Shop from "../pages/Shop";          
import ProductPage from "../pages/ProductPage"; 
import CartPage from "../pages/CartPage";
import WishlistPage from "../pages/WishlistPage"; // ✅ ADD
import CheckoutPage from "../pages/CheckoutPage";
import OrdersPage from "../pages/OrdersPage";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import EmailOtpVerification from "../pages/auth/EmailOtpVerification";
import PhoneOtpVerification from "../pages/auth/PhoneOtpVerification";
import CreateProductPage from "../pages/admin/products/CreateProductPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* HOME */}
      <Route path="/" element={<Home />} />

      {/* SHOP */}
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:slug" element={<ProductPage />} />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/email-otp" element={<EmailOtpVerification />} />
      <Route path="/phone-otp" element={<PhoneOtpVerification />} />

      {/* ADMIN */}
      <Route path="/admin/products/create" element={<CreateProductPage />} />

      {/* CART */}
      <Route path="/cart" element={<CartPage />} />

      {/* WISHLIST ✅ */}
      <Route path="/wishlist" element={<WishlistPage />} />

      <Route path="/checkout" element={<CheckoutPage />} />
<Route path="/orders" element={<OrdersPage />} />

    </Routes>
  );
}
