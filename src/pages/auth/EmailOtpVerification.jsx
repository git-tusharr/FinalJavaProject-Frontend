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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Email OTP Verification</h2>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition-colors"
        >
          Verify
        </button>
      </form>
    </div>
  );
}
