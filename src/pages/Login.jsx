import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authController } from "../controllers/authController";
import { useCart } from "../services/CartContext";
export default function Login() {
  const [data, setData] = useState({ identifier: "", password: "" });
   const { cartCount } = useCart();
      const { loadCartCount } = useCart();
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const token = await authController.login(data);
      localStorage.setItem("token", token);
      
    let roles = [];
       try {
      const payloadBase64 = token.split(".")[1];
      const decoded = JSON.parse(atob(payloadBase64));

      if (decoded.userId) localStorage.setItem("userId", decoded.userId);
      if (decoded.username) localStorage.setItem("username", decoded.username);
      if (decoded.sub) localStorage.setItem("email", decoded.sub);

  if (decoded.roles && Array.isArray(decoded.roles)) {
        roles = decoded.roles;
        localStorage.setItem("roles", JSON.stringify(roles));
        
  }


    } catch (e) {
      console.warn("JWT decode failed");
    }
     await loadCartCount();
      // alert("Login successful"+" "+roles);

if (roles.includes("SUPER_ADMIN") || roles.includes("ADMIN")) {
      navigate("/admin");
    } else if (roles.includes("SELLER")) {
      navigate("/admin/sellerpannel");
    } else {
     
      navigate("/");
    }

     
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3 className="text-center mb-3">Login</h3>

      <input
        className="form-control mb-2"
        placeholder="Email / Phone / Username"
        onChange={e => setData({ ...data, identifier: e.target.value })}
      />

      <input
        type="password"
        className="form-control mb-1"
        placeholder="Password"
        onChange={e => setData({ ...data, password: e.target.value })}
      />

      {/* Forgot Password Link */}
      <div className="text-end mb-3">
        <button
          className="btn btn-link p-0"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </button>
      </div>

      <button className="btn btn-primary w-100" onClick={submit}>
        Login
      </button>
    </div>
  );
}
