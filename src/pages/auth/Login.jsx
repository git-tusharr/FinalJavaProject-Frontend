import { useEffect, useState } from "react";
import { authController } from "../../controllers/authController";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const token = await authController.login({ email, password });
      localStorage.setItem("token", token);
      alert("Login successful");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      callback: handleGoogleLogin,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      const token = await authController.googleLogin(response.credential);
      localStorage.setItem("token", token);
      alert("Google Login Successful");
    } catch (err) {
      console.error(err);
      alert("Google Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        <div className="my-4 border-t border-gray-300"></div>

        <div id="googleBtn" className="flex justify-center"></div>
      </div>
    </div>
  );
}
