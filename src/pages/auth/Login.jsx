import { useEffect, useState } from "react";
import { authController } from "../../controllers/authController";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const token = await authController.login({ email, password });
    localStorage.setItem("token", token);
    alert("Login successful");
  };

  // ✅ GOOGLE LOGIN (NO NPM, BACKEND HANDLES EVERYTHING)
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      callback: handleGoogleLogin
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
      alert("Google Login Failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>

      <hr />

      {/* ✅ GOOGLE BUTTON */}
      <div id="googleBtn"></div>
    </form>
  );
}
