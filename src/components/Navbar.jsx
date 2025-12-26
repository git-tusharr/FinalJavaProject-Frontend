import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <h3>Auth App</h3>

      <div style={styles.links}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/forgot-password">Forgot Password</Link>
        <Link to="/">Home</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#2563eb",
    color: "white",
  },
  links: {
    display: "flex",
    gap: "15px",
  },
};
