import { useEffect } from "react";
import { authController } from "../controllers/authController";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useCart } from "../services/CartContext";

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const { loadCartCount } = useCart();

  const handleGoogleResponse = async (response) => {
    try {
      const token = await authController.googleLogin(response.credential);
      localStorage.setItem("token", token);

      // ✅ Extract all fields from JWT — same as Login.jsx
      try {
        const payloadBase64 = token.split(".")[1];
        const decoded = JSON.parse(atob(payloadBase64));

        if (decoded.userId)   localStorage.setItem("userId",   decoded.userId);
        if (decoded.username) localStorage.setItem("username", decoded.username);
        if (decoded.sub)      localStorage.setItem("email",    decoded.sub);

        if (decoded.roles && Array.isArray(decoded.roles)) {
          localStorage.setItem("roles", JSON.stringify(decoded.roles));
        }
      } catch {
        console.warn("JWT decode failed");
      }

      await loadCartCount();
      navigate("/");

    } catch (err) {
      alert("Google Login Failed");
    }
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "951829169208-7mi1dr9queja6kcf5kafjghodpfqca75.apps.googleusercontent.com",
      callback: handleGoogleResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      {
        theme: "filled_black",  // ✅ dark theme to match our UI
        size: "large",
        width: 400,             // fills the card width
        shape: "rectangular",
      }
    );
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        // ✅ wrapper forces Google's iframe to look at home on dark bg
        "& > div, & iframe": {
          borderRadius: "8px !important",
          overflow: "hidden",
        },
      }}
    >
      <div id="googleBtn" />
    </Box>
  );
}