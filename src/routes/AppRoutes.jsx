import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import EmailOtpVerification from "../pages/auth/EmailOtpVerification";
import PhoneOtpVerification from "../pages/auth/PhoneOtpVerification";
import ResetPassword from "../pages/auth/ResetPassword"; // ✅ ADD THIS
import Home from "../pages/Home";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🏠 Home */}
      <Route path="/" element={<Home />} />

      {/* 🔐 Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* 🔑 Password Reset */}
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 🔢 OTP Verification */}
      <Route path="/email-otp" element={<EmailOtpVerification />} />
      <Route path="/phone-otp" element={<PhoneOtpVerification />} />
    </Routes>
  );
}
