import { authService } from "../services/authService";

export const authController = {

  // 🔹 REGISTER
  async register(data) {
    const res = await authService.register(data);
    return res.data;
  },

  // 🔹 LOGIN
  async login(data) {
    const res = await authService.login(data);
    return res.data;
  },

  // 🔹 FORGOT PASSWORD
  async forgotPassword(data) {
    const res = await authService.forgotPassword(data);
    return res.data;
  },

  // 🔹 RESET PASSWORD
  async resetPassword(data) {
    const res = await authService.resetPassword(data);
    return res.data;
  },

  // 🔹 GOOGLE LOGIN
  async googleLogin(idToken) {
    const res = await authService.googleLogin(idToken);
    return res.data;
  },

  // 🔹 VERIFY EMAIL OTP (BACKEND USES @RequestParam)
  async verifyEmailOtp({ email, otp }) {
    const res = await authService.verifyEmailOtp({ email, otp });
    return res.data;
  },

  //  VERIFY PHONE OTP (BACKEND USES @RequestParam)
  async verifyPhoneOtp({ phone, otp }) {
    const res = await authService.verifyPhoneOtp({ phone, otp });
    return res.data;
  }
};

//updated



