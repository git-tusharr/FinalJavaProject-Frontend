import { toast } from "react-toastify";
import { useState } from "react";
import { authController } from "../controllers/authController";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async () => {
    try {
      await authController.forgotPassword({ email });
      toast.success("If this email exists, a reset link has been sent!");
    } catch (err) {
      toast.success("Error sending reset link");
    }
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3 className="text-center mb-3">Forgot Password</h3>

      <input
        type="email"
        className="form-control mb-3"
        placeholder="Enter your registered email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="btn btn-primary w-100" onClick={submit}>
        Send Reset Link
      </button>
    </div>
  );
}
