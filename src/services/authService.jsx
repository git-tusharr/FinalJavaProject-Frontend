import api from "../api/axiosInstance";

export const authService = {

  register: (data) => api.post("/register", data),

  verifyEmailOtp: (email, otp) =>
    api.post(`/verify-email-otp?email=${email}&otp=${otp}`),

  verifyPhoneOtp: (phone, otp) =>
    api.post(`/verify-phone-otp?phone=${phone}&otp=${otp}`),

  login: (data) => api.post("/login", data),

  googleLogin: (idToken) => api.post("/google", { idToken }),

  forgotPassword: (data) => api.post("/forgot-password", data),

  validateResetToken: (token) =>
    api.get(`/reset-password/validate?token=${token}`),
  
  resetPassword: (data) => api.post("/reset-password", data)
};
