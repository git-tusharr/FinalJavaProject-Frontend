import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <h3 className="text-xl font-bold">Auth App</h3>

      <div className="flex gap-6">
        <Link
          to="/login"
          className="hover:text-gray-200 transition-colors font-medium"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="hover:text-gray-200 transition-colors font-medium"
        >
          Register
        </Link>
        <Link
          to="/forgot-password"
          className="hover:text-gray-200 transition-colors font-medium"
        >
          Forgot Password
        </Link>
        <Link
          to="/"
          className="hover:text-gray-200 transition-colors font-medium"
        >
          Home
        </Link>
      </div>
    </nav>
  );
}
