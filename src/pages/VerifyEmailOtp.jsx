import { useState } from "react";
import { authController } from "../controllers/authController";
import { useNavigate } from "react-router-dom";

export default function VerifyEmailOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    await authController.verifyEmailOtp(email, otp);
    alert("Email verified");
    navigate("/verify-phone");
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3 className="text-center mb-3">Verify Email OTP</h3>

      <input className="form-control mb-2" placeholder="Email"
        onChange={e => setEmail(e.target.value)} />

      <input className="form-control mb-3" placeholder="OTP"
        onChange={e => setOtp(e.target.value)} />

      <button className="btn btn-success w-100" onClick={submit}>
        Verify Email
      </button>
    </div>
  );
}
