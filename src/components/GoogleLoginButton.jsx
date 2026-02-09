import { useEffect } from "react";
import { authController } from "../controllers/authController";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginButton() {
  const navigate = useNavigate();

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:"951829169208-7mi1dr9queja6kcf5kafjghodpfqca75.apps.googleusercontent.com",
      callback: handleGoogleResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      {
        theme: "outline",
        size: "large",
     
      }
    );
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const token = await authController.googleLogin(response.credential);
      localStorage.setItem("token", token);
      alert("Google Login Successful");
      navigate("/");
    } catch (err) {
      alert("Google Login Failed");
    }
  };

  return <div id="googleBtn" className="d-flex justify-content-center"></div>;
}
