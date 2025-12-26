import { useState } from "react";
import { authController } from "../../controllers/authController";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async () => {
    try {
      await authController.forgotPassword({ email });
      alert("Reset link sent to your email!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="bg-gray-900 border border-red-600/30 p-8 rounded-2xl shadow-2xl w-full max-w-md">

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center mb-3">
          <span className="text-red-500">Forgot</span>{" "}
          <span className="text-yellow-400">Password?</span>
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 text-center text-sm mb-6">
          No worries. We’ll send you a reset link to your email.
        </p>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-500"
          />

          <button
            onClick={submit}
            className="bg-red-600 text-white py-3 rounded-lg font-semibold
                       hover:bg-red-700 transition duration-300 shadow-lg
                       active:scale-95"
          >
            Send Reset Link
          </button>
        </div>

        {/* Footer Hint */}
        <p className="text-gray-500 text-xs text-center mt-6">
          Check your spam folder if you don’t see the email.
        </p>
      </div>
    </div>
  );
}
