import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box, Typography, InputBase, CircularProgress,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { authController } from "../controllers/authController";
import { useCart } from "../services/CartContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
import logo from "/logo.png";

/* ── brand tokens ── */
const T = {
  black: "#080808",
  surface: "#111111",
  card: "#141414",
  border: "#1e1e1e",
  gold: "#E9B949",
  goldHov: "#f5c84e",
  red: "#D0312D",
  text: "#e2e2e2",
  muted: "#666666",
};

const SYNE = "'Syne', sans-serif";
const DM = "'DM Sans', sans-serif";

/* ── reusable field ── */
function Field({ icon, placeholder, type = "text", value, onChange }) {
  const [focused, setFocused] = useState(false);

  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: 1.5,
      bgcolor: T.card,
      border: `1.5px solid ${focused ? T.gold : T.border}`,
      borderRadius: "8px", px: 2, py: "11px",
      transition: "all .2s",
      boxShadow: focused ? "0 0 0 3px rgba(233,185,73,.08)" : "none",
    }}>
      <Box sx={{ color: focused ? T.gold : T.muted }}>
        {icon}
      </Box>
      <InputBase
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        sx={{
          flex: 1,
          fontFamily: DM,
          fontSize: 14,
          color: T.text,
          "& input::placeholder": { color: T.muted },
        }}
      />
    </Box>
  );
}

export default function Login() {
  const [data, setData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loadCartCount } = useCart();

  const submit = async () => {
    setLoading(true);
    try {
      const token = await authController.login(data);

      /* ── 1. Store token ── */
      localStorage.setItem("token", token);

      let roles = [];

      /* ── 2. Decode JWT and store all fields immediately ── */
      try {
        const payloadBase64 = token.split(".")[1];
        const decoded = JSON.parse(atob(payloadBase64));

        if (decoded.userId)  localStorage.setItem("userId",   decoded.userId);
        if (decoded.username) localStorage.setItem("username", decoded.username);
        if (decoded.sub)     localStorage.setItem("email",    decoded.sub);

        if (decoded.roles && Array.isArray(decoded.roles)) {
          roles = decoded.roles;
          localStorage.setItem("roles", JSON.stringify(roles));
        }
      } catch {
        console.warn("JWT decode failed");
      }

      /* ── 3. Dispatch storage event so Navbar re-reads localStorage ──
              window.dispatchEvent is needed because the storage event
              only fires across tabs by default, not in the same tab.   */
      window.dispatchEvent(new Event("storage"));

      /* ── 4. Load cart, then redirect ── */
      await loadCartCount();

      if (roles.includes("SUPER_ADMIN") || roles.includes("ADMIN")) {
        navigate("/admin");
      } else if (roles.includes("SELLER")) {
        navigate("/admin/sellerpannel");
      } else {
        navigate("/");
      }

    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: T.black,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      px: 2,
      py: 6,
      fontFamily: DM,
      background: `radial-gradient(ellipse at 60% 0%, rgba(233,185,73,.07) 0%, transparent 60%),
                   radial-gradient(ellipse at 20% 100%, rgba(208,49,45,.06) 0%, transparent 55%),
                   ${T.black}`,
    }}>
      <Box sx={{
        width: "100%",
        maxWidth: 440,
        bgcolor: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,.6)",
      }}>

        {/* Top gradient bar */}
        <Box sx={{
          height: 3,
          background: `linear-gradient(90deg, ${T.red}, ${T.gold})`
        }} />

        <Box sx={{ p: { xs: 3, sm: 4 } }}>

          {/* Logo */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box component={Link} to="/" sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.2,
              textDecoration: "none",
              mb: 2.5
            }}>
              <Box component="img" src={logo} sx={{
                width: 36,
                filter: "drop-shadow(0 0 6px rgba(233,185,73,.3))"
              }} />
              <Typography sx={{
                fontFamily: SYNE,
                fontWeight: 800,
                color: "#fff",
                "& span": { color: T.gold }
              }}>
                Steal<span>Deals</span>
              </Typography>
            </Box>

            <Typography sx={{
              fontFamily: SYNE,
              fontSize: 22,
              fontWeight: 800,
              color: "#fff"
            }}>
              Welcome back
            </Typography>

            <Typography sx={{ fontSize: 13, color: T.muted }}>
              Login to continue grabbing deals
            </Typography>
          </Box>

          {/* Fields */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8, mb: 2.5 }}>
            <Field
              icon={<EmailOutlinedIcon />}
              placeholder="Email / Phone / Username"
              value={data.identifier}
              onChange={(e) => setData({ ...data, identifier: e.target.value })}
            />
            <Field
              icon={<LockOutlinedIcon />}
              type="password"
              placeholder="Password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </Box>

          {/* Forgot password */}
          <Typography
            onClick={() => navigate("/forgot-password")}
            sx={{
              textAlign: "right",
              fontSize: 12,
              color: T.gold,
              cursor: "pointer",
              mb: 2,
              "&:hover": { textDecoration: "underline" }
            }}
          >
            Forgot Password?
          </Typography>

          {/* Login button */}
          <Box
            component="button"
            onClick={submit}
            disabled={loading}
            sx={{
              width: "100%",
              bgcolor: T.gold,
              color: "#000",
              border: "none",
              borderRadius: "8px",
              py: "13px",
              fontFamily: SYNE,
              fontWeight: 700,
              cursor: "pointer",
              transition: ".2s",
              "&:hover": { bgcolor: T.goldHov }
            }}
          >
            {loading
              ? <CircularProgress size={16} sx={{ color: "#000" }} />
              : "Login"}
          </Box>

          {/* Divider */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
            <Box sx={{ flex: 1, height: 1, bgcolor: T.border }} />
            <Typography sx={{ fontSize: 11, color: T.muted }}>
              OR
            </Typography>
            <Box sx={{ flex: 1, height: 1, bgcolor: T.border }} />
          </Box>

          {/* Google login */}
          <GoogleLoginButton />

          {/* Register link */}
          <Typography sx={{ textAlign: "center", mt: 3, fontSize: 13, color: T.muted }}>
            Don't have an account?{" "}
            <Box component={Link} to="/register" sx={{
              color: T.gold,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" }
            }}>
              Register
            </Box>
          </Typography>

        </Box>
      </Box>
    </Box>
  );
}
