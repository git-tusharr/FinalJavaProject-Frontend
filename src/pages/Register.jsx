import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box, Typography, InputBase, CircularProgress,
} from "@mui/material";
import PersonOutlineIcon  from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon  from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon   from "@mui/icons-material/LockOutlined";
import PhoneOutlinedIcon  from "@mui/icons-material/PhoneOutlined";
import { authController } from "../controllers/authController";
import GoogleLoginButton  from "../components/GoogleLoginButton";
import logo from "../assets/logo.png";

/* ── brand tokens ── */
const T = {
  black:   "#080808",
  surface: "#111111",
  card:    "#141414",
  border:  "#1e1e1e",
  gold:    "#E9B949",
  goldHov: "#f5c84e",
  red:     "#D0312D",
  text:    "#e2e2e2",
  muted:   "#666666",
};

const SYNE = "'Syne', sans-serif";
const DM   = "'DM Sans', sans-serif";

/* ── reusable input field ── */
function Field({ icon, placeholder, type = "text", value, onChange }) {
  const [focused, setFocused] = useState(false);

  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: 1.5,
      bgcolor: T.card,
      border: `1.5px solid ${focused ? T.gold : T.border}`,
      borderRadius: "8px", px: 2, py: "11px",
      transition: "border-color .2s, box-shadow .2s",
      boxShadow: focused ? "0 0 0 3px rgba(233,185,73,.08)" : "none",
    }}>
      <Box sx={{ color: focused ? T.gold : T.muted, display: "flex", flexShrink: 0, transition: "color .2s" }}>
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
          fontFamily: DM, fontSize: 14, color: T.text,
          "& input::placeholder": { color: T.muted },
          "& input": { p: 0 },
        }}
      />
    </Box>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "", password: "", username: "", phone: "",
  });

  const set = (key) => (e) => setUser({ ...user, [key]: e.target.value });

  const submit = async () => {
    setLoading(true);
    try {
      await authController.register(user);
      alert("Registered successfully. Verify OTPs.");
      navigate("/verify-email");
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
      /* subtle radial glow */
      background: `radial-gradient(ellipse at 60% 0%, rgba(233,185,73,.07) 0%, transparent 60%),
                   radial-gradient(ellipse at 20% 100%, rgba(208,49,45,.06) 0%, transparent 55%),
                   ${T.black}`,
    }}>
      <Box sx={{
        width: "100%", maxWidth: 440,
        bgcolor: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,.6)",
      }}>

        {/* ── Top accent bar ── */}
        <Box sx={{ height: 3, background: `linear-gradient(90deg, ${T.red} 0%, ${T.gold} 100%)` }} />

        <Box sx={{ p: { xs: 3, sm: 4 } }}>

          {/* ── Logo + heading ── */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              component={Link} to="/"
              sx={{ display: "inline-flex", alignItems: "center", gap: 1.2, textDecoration: "none", mb: 2.5 }}
            >
              <Box component="img" src={logo} alt="StealDeals" sx={{
                width: 36, height: 36, objectFit: "contain",
                filter: "drop-shadow(0 0 6px rgba(233,185,73,.3))",
              }} />
              <Typography sx={{
                fontFamily: SYNE, fontSize: 19, fontWeight: 800, color: "#fff",
                "& span": { color: T.gold },
              }}>
                Steal<span>Deals</span>
              </Typography>
            </Box>

            <Typography sx={{
              fontFamily: SYNE, fontSize: 22, fontWeight: 800,
              color: "#fff", mb: 0.8,
            }}>
              Create your account
            </Typography>
            <Typography sx={{ fontSize: 13, color: T.muted }}>
              Join thousands stealing deals every day
            </Typography>
          </Box>

          {/* ── Fields ── */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8, mb: 2.5 }}>
            <Field
              icon={<PersonOutlineIcon sx={{ fontSize: 19 }} />}
              placeholder="Username"
              value={user.username}
              onChange={set("username")}
            />
            <Field
              icon={<EmailOutlinedIcon sx={{ fontSize: 19 }} />}
              placeholder="Email address"
              type="email"
              value={user.email}
              onChange={set("email")}
            />
            <Field
              icon={<PhoneOutlinedIcon sx={{ fontSize: 19 }} />}
              placeholder="Phone number"
              type="tel"
              value={user.phone}
              onChange={set("phone")}
            />
            <Field
              icon={<LockOutlinedIcon sx={{ fontSize: 19 }} />}
              placeholder="Password"
              type="password"
              value={user.password}
              onChange={set("password")}
            />
          </Box>

          {/* ── Register button ── */}
          <Box
            component="button"
            onClick={submit}
            disabled={loading}
            sx={{
              width: "100%", display: "flex",
              alignItems: "center", justifyContent: "center", gap: 1,
              bgcolor: T.gold, color: "#000",
              border: "none", borderRadius: "8px",
              py: "13px",
              fontFamily: SYNE, fontSize: 13, fontWeight: 700,
              letterSpacing: ".9px", textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 4px 20px rgba(233,185,73,.2)",
              transition: "background .2s, transform .15s, box-shadow .2s",
              "&:hover": !loading ? {
                bgcolor: T.goldHov,
                transform: "translateY(-1px)",
                boxShadow: "0 8px 28px rgba(233,185,73,.3)",
              } : {},
            }}
          >
            {loading
              ? <CircularProgress size={16} sx={{ color: "#000" }} />
              : "Create Account"}
          </Box>

          {/* ── Divider ── */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
            <Box sx={{ flex: 1, height: "1px", bgcolor: T.border }} />
            <Typography sx={{ fontSize: 11, color: T.muted, fontWeight: 600,
              letterSpacing: ".8px", textTransform: "uppercase" }}>
              or continue with
            </Typography>
            <Box sx={{ flex: 1, height: "1px", bgcolor: T.border }} />
          </Box>

          {/* ── Google button ── */}
          <GoogleLoginButton />

          {/* ── Sign in link ── */}
          <Typography sx={{ textAlign: "center", mt: 3, fontSize: 13, color: T.muted }}>
            Already have an account?{" "}
            <Box
              component={Link} to="/login"
              sx={{ color: T.gold, fontWeight: 600, textDecoration: "none",
                "&:hover": { textDecoration: "underline" } }}
            >
              Sign in
            </Box>
          </Typography>

        </Box>
      </Box>
    </Box>
  );
}