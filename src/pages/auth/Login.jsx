import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authController } from "../../controllers/authController";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ Add navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const token = await authController.login({ email, password });
      localStorage.setItem("token", token);
      alert("Login successful");
      navigate("/"); // ✅ Redirect to home
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
      navigate("/home"); // ✅ Redirect after Google login as well
    } catch (err) {
      console.error(err);
      alert("Google Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="bg-gray-900 border border-red-600/30 p-8 rounded-2xl shadow-2xl w-full max-w-md">

        <h2 className="text-3xl font-extrabold text-center mb-6">
          <span className="text-red-500">Welcome</span>{" "}
          <span className="text-yellow-400">Back</span>
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300 shadow-lg"
          >
            Login
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <div id="googleBtn" className="flex justify-center"></div>
      </div>
    </div>
  );
}
