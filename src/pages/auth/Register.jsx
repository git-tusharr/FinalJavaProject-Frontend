import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authController } from "../../controllers/authController";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handle normal registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const msg = await authController.register(form);
      alert(msg.message || msg); // show success message

      // ✅ Redirect to Email OTP verification page
      navigate("/email-otp", {
        state: { email: form.email, phone: form.phone },
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  // ✅ GOOGLE REGISTER / LOGIN
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "660129225344-lqdgo1vjjbf3209aspcmps932rinbnn7.apps.googleusercontent.com",
      callback: handleGoogleRegister,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleRegisterBtn"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleGoogleRegister = async (response) => {
    try {
      const token = await authController.googleLogin(response.credential);
      localStorage.setItem("token", token);
      alert("Registered / Logged in with Google");
      navigate("/home"); // redirect Google users directly to home
    } catch (err) {
      console.error(err);
      alert("Google registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        placeholder="Phone"
        type="tel"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        required
      />

      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <button type="submit">Register</button>

      <hr />

      {/* ✅ GOOGLE BUTTON */}
      <div id="googleRegisterBtn"></div>
    </form>
  );
}
