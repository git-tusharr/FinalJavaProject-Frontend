import { toast } from "react-toastify";
import { useState } from "react";
import { authController } from "../controllers/authController";
import { Box, CircularProgress } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

/* ── Brand tokens ── */
const T = {
  black:   "#080808",
  surface: "#111111",
  card:    "#141414",
  border:  "#1e1e1e",
  gold:    "#E9B949",
  goldHov: "#f5c84e",
  goldDim: "rgba(233,185,73,.08)",
  goldRim: "rgba(233,185,73,.18)",
  red:     "#D0312D",
  text:    "#e2e2e2",
  muted:   "#555555",
};

const SYNE = "'Syne', sans-serif";
const DM   = "'DM Sans', sans-serif";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      await authController.forgotPassword({ email });
      toast.success("If this email exists, a reset link has been sent!");
    } catch (err) {
      toast.error("Error sending reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: T.black,
      fontFamily: DM,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      px: 2, py: 6,
      background: `
        radial-gradient(ellipse at 65% 0%, rgba(233,185,73,.06) 0%, transparent 55%),
        radial-gradient(ellipse at 20% 100%, rgba(208,49,45,.05) 0%, transparent 50%),
        ${T.black}
      `,
    }}>

      <Box sx={{
        width: "100%",
        maxWidth: 460,
        bgcolor: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,.6)",
      }}>

        {/* Top gradient bar */}
        <Box sx={{
          height: 3,
          background: `linear-gradient(90deg, ${T.red}, ${T.gold})`,
        }} />

        <Box sx={{ p: { xs: 3, sm: 4 } }}>

          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
            <Box sx={{
              width: 40, height: 40,
              borderRadius: "11px",
              bgcolor: T.goldDim,
              border: `1px solid ${T.goldRim}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <EmailIcon sx={{ fontSize: 20, color: T.gold }} />
            </Box>

            <Box>
              <Box sx={{
                fontFamily: SYNE,
                fontWeight: 800,
                fontSize: 20,
                color: "#fff",
              }}>
                Forgot{" "}
                <Box component="span" sx={{ color: T.gold }}>
                  Password
                </Box>
              </Box>
              <Box sx={{
                fontSize: 12,
                color: T.muted,
                mt: "3px",
              }}>
                We’ll send you a reset link
              </Box>
            </Box>
          </Box>

          {/* Email Input */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{
              fontFamily: SYNE,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
              color: T.muted,
              mb: 1,
            }}>
              Email Address
            </Box>

            <Box
              component="input"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                width: "100%",
                bgcolor: T.card,
                border: `1.5px solid ${T.border}`,
                borderRadius: "10px",
                p: "12px 14px",
                color: T.text,
                outline: "none",
                transition: "all .2s",
                "&:focus": {
                  borderColor: T.gold,
                  boxShadow: "0 0 0 3px rgba(233,185,73,.08)",
                },
              }}
            />
          </Box>

          {/* Submit Button */}
          <Box
            component="button"
            onClick={submit}
            disabled={loading}
            sx={{
              width: "100%",
              py: "13px",
              bgcolor: loading ? T.border : T.gold,
              color: loading ? T.muted : "#000",
              border: "none",
              borderRadius: "10px",
              fontFamily: SYNE,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: ".8px",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all .2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              "&:hover": !loading ? {
                bgcolor: T.goldHov,
                transform: "translateY(-2px)",
                boxShadow: "0 8px 28px rgba(233,185,73,.3)",
              } : {},
            }}
          >
            {loading ? (
              <CircularProgress size={16} sx={{ color: T.muted }} />
            ) : (
              <EmailIcon sx={{ fontSize: 18 }} />
            )}
            {loading ? "Sending..." : "Send Reset Link"}
          </Box>

        </Box>
      </Box>
    </Box>
  );
}