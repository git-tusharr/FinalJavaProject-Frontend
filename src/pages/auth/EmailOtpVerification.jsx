import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authController } from "../../controllers/authController"; // ✅ CORRECT

export default function EmailOtpVerification() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { email, phone } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authController.verifyEmailOtp({ email, otp });
      alert("Email verified!");
      navigate("/phone-otp", { state: { phone } });
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Email OTP Verification</h2>

      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        required
      />

      <button type="submit">Verify</button>
    </form>
  );
}
