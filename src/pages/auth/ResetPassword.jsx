import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authController } from "../../controllers/authController";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Reset link is invalid or expired");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await authController.resetPassword({ token, newPassword });
      alert("Password reset successful! Redirecting to login...");
      navigate("/login"); // redirect to login
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="bg-gray-900 border border-red-600/30 p-8 rounded-2xl shadow-2xl w-full max-w-md">

        <h2 className="text-3xl font-extrabold text-center mb-6">
          <span className="text-red-500">Reset</span>{" "}
          <span className="text-yellow-400">Password</span>
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300 shadow-lg"
          >
            Reset Password
          </button>
        </form>

        {!token && (
          <p className="text-red-500 mt-4 text-center">
            Reset link is invalid or expired
          </p>
        )}

        <p className="text-gray-400 text-sm text-center mt-6">
          After resetting, you will be redirected to login.
        </p>
      </div>
    </div>
  );
}
