import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  // Load from localStorage on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setAuth({
        token,
        email: decoded.sub,
        username: decoded.username,
      });
    }
  }, []);

  const login = (token) => {
    const decoded = jwtDecode(token);

    localStorage.setItem("token", token);
    setAuth({
      token,
      email: decoded.sub,
      username: decoded.username,
    });
  };

  const logout = () => {
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
