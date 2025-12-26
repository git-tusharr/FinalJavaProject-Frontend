import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authController } from "../../controllers/authController";

export default function PhoneOtpVerification() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone;

  // 🔒 Prevent direct access
  useEffect(() => {
    if (!phone) {
      alert("Phone number missing. Please register again.");
      navigate("/register");
    }
  }, [phone, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authController.verifyPhoneOtp({ phone, otp });
      alert("Phone verified!");
      navigate("/"); // ✅ correct route
    } catch (err) {
      console.error(err);
      alert("Invalid OTP, try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Phone OTP Verification</h2>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />

      <button type="submit">Verify</button>
    </form>
  );
}
