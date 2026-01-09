import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authController } from "../../controllers/authController";

export default function EmailOtpVerification() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { email, phone } = location.state || {};

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setErrorMessage("OTP must be exactly 6 digits.");
      return;
    }

    if (!email) {
      setErrorMessage("Email not found. Please restart verification.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await authController.verifyEmailOtp({ email, otp: otpValue });
      navigate("/phone-otp", { state: { phone } });
    } catch {
      setErrorMessage("Invalid OTP, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="bg-gray-900 border border-red-600/30 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md">

        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-2">
          <span className="text-red-500">Email</span>{" "}
          <span className="text-yellow-400">Verification</span>
        </h2>

        <p className="text-gray-400 text-center text-sm mb-6">
          Enter the 6-digit OTP sent to your email
        </p>

        {errorMessage && (
          <p className="text-red-500 text-xs text-center mb-4">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-between gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-11 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold
                           bg-black text-white border border-gray-700 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-red-600 text-white py-3 rounded-lg font-semibold
                       hover:bg-red-700 transition duration-300 shadow-lg
                       active:scale-95 ${
                         loading ? "opacity-50 cursor-not-allowed" : ""
                       }`}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>




        

        <p className="text-gray-500 text-xs text-center mt-6">
          Didn’t receive the email? Check your spam folder.
        </p>
      </div>
    </div>
  );
}
