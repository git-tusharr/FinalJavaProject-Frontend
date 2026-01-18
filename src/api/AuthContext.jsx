import { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  // Load from localStorage on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      // ⏰ Optional: token expiry check
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return;
      }

      const authData = {
        token,
        email: decoded.sub,
        username: decoded.username,
        userId: decoded.id,
      };

      console.log("🔁 Auth restored:", authData);

      setAuth(authData);
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
    }
  }, []);

  const login = (token) => {
    const decoded = jwtDecode(token);

    const authData = {
      token,
      email: decoded.sub,
      username: decoded.username,
      userId: decoded.id,
    };

    console.log("✅ User logged in:", authData);

    localStorage.setItem("token", token);
    setAuth(authData);
  };

  const logout = () => {
    console.log("🚪 User logged out");
    localStorage.removeItem("token");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
