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
  forgotPassword: (data) =>
    api.post("/forgot-password", data),

  validateToken: (token) =>
    api.get("/reset-password/validate", {
      params: { token },
    }),

  resetPassword: (data) =>
    api.post("/reset-password", data),

  // 🔹 EMAIL OTP
  verifyEmailOtp: ({ email, otp }) =>
    api.post("/verify-email-otp", null, {
      params: { email, otp },
    }),

  // 🔹 PHONE OTP
  verifyPhoneOtp: ({ phone, otp }) =>
    api.post("/verify-phone-otp", null, {
      params: { phone, otp },
    }),
};
