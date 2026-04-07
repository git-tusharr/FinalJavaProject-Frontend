import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const location = useLocation();

  // Hide site Navbar + Footer on all /admin/* routes
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <AppRoutes />
      {!isAdmin && <Footer />}
    </>
  );
}