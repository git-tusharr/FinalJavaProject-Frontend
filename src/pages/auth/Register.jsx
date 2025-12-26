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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="bg-gray-900 border border-red-600/30 p-8 rounded-2xl shadow-2xl w-full max-w-md">

        <h2 className="text-3xl font-extrabold text-center mb-6">
          <span className="text-red-500">Create</span>{" "}
          <span className="text-yellow-400">Account</span>
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300 shadow-lg"
          >
            Register
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <div id="googleRegisterBtn" className="flex justify-center"></div>
      </div>
    </div>
  );
}
