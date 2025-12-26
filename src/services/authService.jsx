import api from "../api/axiosInstance";

export const authService = {
  // 🔹 REGISTER
  register: (data) => api.post("/register", data),

  // 🔹 LOGIN
  login: (data) => api.post("/login", data),

  // 🔹 GOOGLE LOGIN
  googleLogin: (idToken) =>
    api.post("/google", { idToken }),

  // 🔹 FORGOT / RESET PASSWORD
  forgotPassword: (data) => api.post("/forgot-password", data),
  resetPassword: (data) => api.post("/reset-password", data),
  validateToken: (token) =>
    api.get(`/reset-password/validate`, { params: { token } }),

  // ✅ EMAIL OTP — FIXED (USES @RequestParam)
  verifyEmailOtp: ({ email, otp }) =>
    api.post("/verify-email-otp", null, {
      params: { email, otp },
    }),

  // ✅ PHONE OTP — FIXED (USES @RequestParam)
  verifyPhoneOtp: ({ phone, otp }) =>
    api.post("/verify-phone-otp", null, {
      params: { phone, otp },
    }),
};
