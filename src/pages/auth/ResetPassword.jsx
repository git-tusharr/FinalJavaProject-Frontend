import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authController } from "../../controllers/authController";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔐 VALIDATE TOKEN ON PAGE LOAD
  useEffect(() => {
    if (!token) {
      setError("Reset token missing");
      setLoading(false);
      return;
    }

    const validate = async () => {
      try {
        await authController.validateToken(token);
        setLoading(false);
      } catch (err) {
        setError("Reset link is invalid or expired");
        setLoading(false);
      }
    };

    validate();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authController.resetPassword({
        token,
        newPassword,
      });

      alert("Password reset successful");
      navigate("/login");
    } catch (err) {
      alert("Failed to reset password");
    }
  };

  if (loading) return <p>Validating reset link...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>

      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />

      <button type="submit">Reset Password</button>
    </form>
  );
}
