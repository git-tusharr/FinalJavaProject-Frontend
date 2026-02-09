import { HttpStatusCode } from "axios";
import { authService } from "../services/authService";

export const authController = {
  async register(data) {
    const res = await authService.register(data);
    return res.data;
  },

  async verifyEmailOtp(email, otp) {
    const res = await authService.verifyEmailOtp(email, otp);
    return res.data;
  },

  async verifyPhoneOtp(phone, otp) {
    const res = await authService.verifyPhoneOtp(phone, otp);
    return res.data;
  },

  async login(data) {
    const res = await authService.login(data);
    return res.data;
  },

  async googleLogin(idToken) {
    const res = await authService.googleLogin(idToken);
    return res.data;
  },

  async forgotPassword(data) {
    const res = await authService.forgotPassword(data);
    return res.data;
  },

  async resetPassword(data) {
    const res = await authService.resetPassword(data);
    return res.data;
  }
};




// INTERCEPTOR
// DIFFRENCE BETWEEN HTTP AND HTTPS
// PROMISE
// ASYNC DEFER



// ASYNC AWAIT
// COMPONENT BASED STRUCYURE