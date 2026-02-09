import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/auth/",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      try {
        const payloadBase64 = token.split(".")[1];
        const decoded = JSON.parse(atob(payloadBase64));

        if (decoded.userId) {
          localStorage.setItem("userId", decoded.userId);
        }

        if (decoded.username) {
          localStorage.setItem("username", decoded.username);
        }

        if (decoded.sub) {
          localStorage.setItem("email", decoded.sub);
        }

        // ✅ NEW: store roles
        if (decoded.roles && Array.isArray(decoded.roles)) {
          localStorage.setItem("roles", JSON.stringify(decoded.roles));
        }

      } catch (e) {
        console.warn("⚠ Invalid token payload");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
