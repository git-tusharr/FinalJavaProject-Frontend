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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Phone OTP Verification</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
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
