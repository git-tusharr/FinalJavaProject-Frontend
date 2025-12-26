import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import logo1 from "../assets/images/logo1.png";

export default function Navbar() {
  return (
    <nav className="bg-black text-white shadow-lg border-b border-red-600">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-4">
          <img
            src={logo1}
            alt="StealDeals Secondary Logo"
            className="h-16 w-16 object-contain"
          />
          <span className="text-3xl font-extrabold tracking-wide">
            <span className="text-red-500">Steal</span>
            <span className="text-yellow-400">Deals</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-10 text-base font-medium">
          <Link to="/" className="hover:text-red-500 transition duration-300">
            Home
          </Link>
          <Link to="/login" className="hover:text-red-500 transition duration-300">
            Login
          </Link>
          <Link to="/register" className="hover:text-red-500 transition duration-300">
            Register
          </Link>
          <Link to="/forgot-password" className="hover:text-red-500 transition duration-300">
            Forgot Password
          </Link>
        </div>
      </div>
    </nav>
  );
}
