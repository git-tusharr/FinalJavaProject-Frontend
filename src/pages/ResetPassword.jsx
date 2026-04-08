import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authController } from "../controllers/authController";

export default function ResetPassword() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    if (!token) {
      toast.success("Invalid reset link");
      navigate("/login");
    }
  }, [token, navigate]);

  const submit = async () => {
    if (password !== confirm) {
      toast.success("Passwords do not match");
      return;
    }
    try {
      await authController.resetPassword({ token, newPassword: password });
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      toast.success("Reset failed. Link may have expired.");
    }
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3 className="text-center mb-3">Reset Password</h3>

      <input
        type="password"
        className="form-control mb-2"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Confirm New Password"
        onChange={(e) => setConfirm(e.target.value)}
      />

      <button className="btn btn-primary w-100" onClick={submit}>
        Reset Password
      </button>
    </div>
  );
}
