import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authController } from "../controllers/authController";
import { Box, CircularProgress } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";

/* ── Brand tokens (same as your review file) ── */
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

export default function ResetPassword() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link");
      navigate("/login");
    }
  }, [token, navigate]);

  const submit = async () => {
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await authController.resetPassword({ token, newPassword: password });
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      toast.error("Reset failed. Link may have expired.");
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
        maxWidth: 480,
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
              <LockResetIcon sx={{ fontSize: 20, color: T.gold }} />
            </Box>

            <Box>
              <Box sx={{
                fontFamily: SYNE,
                fontWeight: 800,
                fontSize: 20,
                color: "#fff",
              }}>
                Reset{" "}
                <Box component="span" sx={{ color: T.gold }}>
                  Password
                </Box>
              </Box>
              <Box sx={{
                fontSize: 12,
                color: T.muted,
                mt: "3px",
              }}>
                Enter your new password below
              </Box>
            </Box>
          </Box>

          {/* Password Input */}
          <Box sx={{ mb: 2.5 }}>
            <Box sx={{
              fontFamily: SYNE,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
              color: T.muted,
              mb: 1,
            }}>
              New Password
            </Box>

            <Box
              component="input"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {/* Confirm Password */}
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
              Confirm Password
            </Box>

            <Box
              component="input"
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
              <LockResetIcon sx={{ fontSize: 18 }} />
            )}
            {loading ? "Resetting..." : "Reset Password"}
          </Box>

          {/* Cancel */}
          <Box
            component="button"
            onClick={() => navigate("/login")}
            sx={{
              width: "100%",
              mt: 1.5,
              py: "11px",
              bgcolor: "transparent",
              border: `1px solid ${T.border}`,
              borderRadius: "10px",
              fontFamily: DM,
              fontSize: 13,
              color: T.muted,
              cursor: "pointer",
              transition: "all .2s",
              "&:hover": {
                borderColor: T.red,
                color: T.red,
                bgcolor: "rgba(208,49,45,.05)",
              },
            }}
          >
            Cancel
          </Box>

        </Box>
      </Box>
    </Box>
  );
}