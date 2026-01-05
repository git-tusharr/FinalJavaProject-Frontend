import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authController } from "../../controllers/authController";

export default function EmailOtpVerification() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { email, phone } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrorMessage("OTP must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    setErrorMessage("");  // Reset error before submission

    try {
      await authController.verifyEmailOtp({ email, otp });
      alert("Email verified successfully!");
      navigate("/phone-otp", { state: { phone } });
    } catch (err) {
      setErrorMessage("Invalid OTP, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="bg-gray-900 border border-red-600/30 p-8 rounded-2xl shadow-2xl w-full max-w-md">

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center mb-3">
          <span className="text-red-500">Email</span>{" "}
          <span className="text-yellow-400">Verification</span>
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 text-center text-sm mb-6">
          Enter the OTP sent to your email address
        </p>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 text-xs text-center mb-4">
            {errorMessage}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            required
            aria-label="Enter OTP"
            maxLength={6}
            className="bg-black text-white border border-gray-700 p-3 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-red-500
                       placeholder-gray-500 tracking-widest text-center text-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-red-600 text-white py-3 rounded-lg font-semibold
                       hover:bg-red-700 transition duration-300 shadow-lg
                       active:scale-95 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {/* Footer Hint */}
        <p className="text-gray-500 text-xs text-center mt-6">
          Didn’t receive the email? Check your spam folder.
        </p>
      </div>
    </div>
  );
}
