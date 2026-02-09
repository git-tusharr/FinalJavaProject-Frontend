import { useState } from "react";
import { authController } from "../controllers/authController";

export default function VerifyPhoneOtp() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const submit = async () => {
    await authController.verifyPhoneOtp(phone, otp);
    alert("Phone verified. Account ACTIVE.");
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3 className="text-center mb-3">Verify Phone OTP</h3>

      <input className="form-control mb-2" placeholder="Phone"
        onChange={e => setPhone(e.target.value)} />

      <input className="form-control mb-3" placeholder="OTP"
        onChange={e => setOtp(e.target.value)} />

      <button className="btn btn-success w-100" onClick={submit}>
        Verify Phone
      </button>
    </div>
  );
}
