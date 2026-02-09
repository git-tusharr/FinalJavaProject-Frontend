import { useState } from "react";
import { authController } from "../controllers/authController";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Register() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
    phone: ""
  });

  const navigate = useNavigate();

  const submit = async () => {
    await authController.register(user);
    alert("Registered successfully. Verify OTPs.");
    navigate("/verify-email");
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3 className="text-center mb-3">Register</h3>

      <input className="form-control mb-2" placeholder="Email"
        onChange={e => setUser({ ...user, email: e.target.value })} />

      <input type="password" className="form-control mb-2" placeholder="Password"
        onChange={e => setUser({ ...user, password: e.target.value })} />

      <input className="form-control mb-2" placeholder="Username"
        onChange={e => setUser({ ...user, username: e.target.value })} />

      <input className="form-control mb-3" placeholder="Phone"
        onChange={e => setUser({ ...user, phone: e.target.value })} />

      <button className="btn btn-primary w-100 mb-3" onClick={submit}>
        Register
      </button>

      <hr />

      {/* ✅ GOOGLE REGISTER / LOGIN */}
      <GoogleLoginButton />
    </div>
  );
}
