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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Forgot Password
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={submit}
            className="bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Send Reset Link
          </button>
        </div>
      </div>
    </div>
  );
}
