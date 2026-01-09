import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authController } from "../../controllers/authController";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = await authController.login({ email, password });
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const token = await authController.googleLogin(response.credential);
      localStorage.setItem("token", token);
      navigate("/");
    } catch {
      setError("Google login failed");
    }
  };

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "outline", size: "large", width: "100%" }
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="bg-gray-900 border border-red-600/30 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md">

        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6">
          <span className="text-red-500">Welcome</span>{" "}
          <span className="text-yellow-400">Back</span>
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            inputMode="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-black text-white border border-gray-700 p-3 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-black text-white border border-gray-700 p-3 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-red-600 text-white py-3 rounded-lg font-semibold
                       hover:bg-red-700 transition duration-300 shadow-lg
                       active:scale-95 ${
                         loading ? "opacity-50 cursor-not-allowed" : ""
                       }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-grow border-t border-gray-700" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-700" />
        </div>






        

        {/* Google Login */}
        <div id="googleBtn" className="flex justify-center w-full" />
      </div>
    </div>
  );
}
