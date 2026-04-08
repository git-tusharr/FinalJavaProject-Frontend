import { toast } from "react-toastify";
import { useState } from "react";
import { authController } from "../controllers/authController";
import { useNavigate, Link } from "react-router-dom";
import { Box, Typography, InputBase, CircularProgress } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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

/* ── reusable field (same as Login/Register) ── */
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

export default function VerifyEmailOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp]     = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    setLoading(true);
    try {
      await authController.verifyEmailOtp(email, otp);
      toast.success("Email verified");
      navigate("/verify-phone");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      px: 2, py: 6,
      fontFamily: DM,
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

        {/* Top accent bar */}
        <Box sx={{ height: 3, background: `linear-gradient(90deg, ${T.red}, ${T.gold})` }} />

        <Box sx={{ p: { xs: 3, sm: 4 } }}>

          {/* Logo */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box component={Link} to="/" sx={{
              display: "inline-flex", alignItems: "center",
              gap: 1.2, textDecoration: "none", mb: 2.5,
            }}>
              <Box component="img" src={logo} sx={{
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

            {/* Step indicator */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3 }}>
              {["Email", "Phone"].map((step, i) => (
                <Box key={step} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 24, height: 24, borderRadius: "50%",
                    bgcolor: i === 0 ? T.gold : T.border,
                    color: i === 0 ? "#000" : T.muted,
                    fontFamily: SYNE, fontSize: 11, fontWeight: 700,
                  }}>
                    {i + 1}
                  </Box>
                  <Typography sx={{
                    fontSize: 11, fontWeight: 700, letterSpacing: ".6px",
                    textTransform: "uppercase",
                    color: i === 0 ? T.gold : T.muted,
                  }}>
                    {step}
                  </Typography>
                  {i === 0 && (
                    <Box sx={{ width: 28, height: 1, bgcolor: T.border }} />
                  )}
                </Box>
              ))}
            </Box>

            <Typography sx={{ fontFamily: SYNE, fontSize: 22, fontWeight: 800, color: "#fff" }}>
              Verify your email
            </Typography>
            <Typography sx={{ fontSize: 13, color: T.muted, mt: 0.5 }}>
              Enter the OTP sent to your email address
            </Typography>
          </Box>

          {/* Fields */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8, mb: 3 }}>
            <Field
              icon={<EmailOutlinedIcon sx={{ fontSize: 19 }} />}
              placeholder="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Field
              icon={<LockOutlinedIcon sx={{ fontSize: 19 }} />}
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
          </Box>

          {/* Submit button */}
          <Box
            component="button"
            onClick={submit}
            disabled={loading}
            sx={{
              width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
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
              : "Verify Email"}
          </Box>

          {/* Back to login */}
          <Typography sx={{ textAlign: "center", mt: 3, fontSize: 13, color: T.muted }}>
            Back to{" "}
            <Box component={Link} to="/login" sx={{
              color: T.gold, fontWeight: 600, textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}>
              Sign in
            </Box>
          </Typography>

        </Box>
      </Box>
    </Box>
  );
}
