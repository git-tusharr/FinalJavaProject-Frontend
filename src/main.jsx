import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="660129225344-lqdgo1vjjbf3209aspcmps932rinbnn7.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
