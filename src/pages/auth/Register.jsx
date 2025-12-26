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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const msg = await authController.register(form);
      alert(msg.message || msg);

      navigate("/email-otp", {
        state: { email: form.email, phone: form.phone },
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

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
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Google registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Register
          </button>
        </form>

        <div className="my-4 border-t border-gray-300"></div>

        <div id="googleRegisterBtn" className="flex justify-center"></div>
      </div>
    </div>
  );
}
