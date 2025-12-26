import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import EmailOtpVerification from "../pages/auth/EmailOtpVerification";
import PhoneOtpVerification from "../pages/auth/PhoneOtpVerification";
import Home from "../pages/Home";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* ✅ OTP Verification Routes */}
      <Route path="/email-otp" element={<EmailOtpVerification />} />
      <Route path="/phone-otp" element={<PhoneOtpVerification />} />
    </Routes>
  );
}
