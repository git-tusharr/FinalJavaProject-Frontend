import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import "./App.css";

// ================= AXIOS CONFIG =================
axios.defaults.baseURL = "http://localhost:8080/auth";

// ================= REGISTER PAGE =================
function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/register", form);
      alert("Registered Successfully!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        /><br /><br />

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        /><br /><br />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        /><br /><br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        /><br /><br />

        <button>Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

// ================= LOGIN PAGE =================
function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // NORMAL LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/login", form);

      // ✅ FIXED: store JWT correctly
      localStorage.setItem("token", res.data.token);

      alert("Login Successful!");
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post("/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      alert("Google Login Successful!");
      navigate("/dashboard");
    } catch (err) {
      alert("Google login failed");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email / Username / Phone"
          value={form.email}
          onChange={handleChange}
        /><br /><br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        /><br /><br />

        <button>Login</button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      {/* GOOGLE LOGIN BUTTON */}
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => alert("Google Login Failed")}
      />

      <p style={{ marginTop: "15px" }}>
        New user? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

// ================= DASHBOARD =================
function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <h2>Welcome to Dashboard</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// ================= PROTECTED ROUTE =================
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

// ================= MAIN APP =================
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
