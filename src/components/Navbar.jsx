// import { Link } from "react-router-dom";
// import { useState } from "react";
// import logo1 from "../assets/images/logo1.png";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <nav className="bg-black text-white shadow-lg border-b border-red-600">
//       <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

//         {/* Logo + Brand */}
//         <Link to="/" className="flex items-center gap-4">
//           <img
//             src={logo1}
//             alt="StealDeals Logo"
//             className="h-14 w-14 object-contain"
//           />
//           <span className="text-2xl md:text-3xl font-extrabold tracking-wide">
//             <span className="text-red-500">Steal</span>
//             <span className="text-yellow-400">Deals</span>
//           </span>
//         </Link>

//         {/* Desktop Links */}
//         <div className="hidden md:flex items-center gap-10 text-base font-medium">
//           <Link to="/" className="hover:text-red-500 transition">Home</Link>
//           <Link to="/login" className="hover:text-red-500 transition">Login</Link>
//           <Link to="/register" className="hover:text-red-500 transition">Register</Link>
//           <Link to="/forgot-password" className="hover:text-red-500 transition">
//             Forgot Password
//           </Link>
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden text-white focus:outline-none"
//           onClick={() => setMenuOpen(!menuOpen)}
//           aria-label="Toggle menu"
//         >
//           <svg
//             className="w-7 h-7"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//           >
//             {menuOpen ? (
//               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//             ) : (
//               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//             )}
//           </svg>
//         </button>
//       </div>

//       {/* Mobile Dropdown */}
//       {menuOpen && (
//         <div className="md:hidden bg-black border-t border-red-600 px-6 pb-6 flex flex-col gap-4 text-base font-medium">
//           <Link onClick={() => setMenuOpen(false)} to="/" className="hover:text-red-500">
//             Home
//           </Link>
//           <Link onClick={() => setMenuOpen(false)} to="/login" className="hover:text-red-500">
//             Login
//           </Link>
//           <Link onClick={() => setMenuOpen(false)} to="/register" className="hover:text-red-500">
//             Register
//           </Link>
//           <Link
//             onClick={() => setMenuOpen(false)}
//             to="/forgot-password"
//             className="hover:text-red-500"
//           >
//             Forgot Password
//           </Link>
//         </div>
//       )}
//     </nav>
//   );
// }
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../api/AuthContext"; // ✅ import AuthContext
import logo1 from "../assets/images/logo1.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { auth, logout } = useAuth(); // ✅ get auth info and logout

  return (
    <nav className="bg-black text-white shadow-lg border-b border-red-600">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-4">
          <img
            src={logo1}
            alt="StealDeals Logo"
            className="h-14 w-14 object-contain"
          />
          <span className="text-2xl md:text-3xl font-extrabold tracking-wide">
            <span className="text-red-500">Steal</span>
            <span className="text-yellow-400">Deals</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 text-base font-medium">
          <Link to="/" className="hover:text-red-500 transition">Home</Link>

          {!auth ? (
            <>
              <Link to="/login" className="hover:text-red-500 transition">Login</Link>
              <Link to="/register" className="hover:text-red-500 transition">Register</Link>
            </>
          ) : (
            <>
              <span className="text-yellow-400">Hi, {auth.username}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-red-600 px-6 pb-6 flex flex-col gap-4 text-base font-medium">
          <Link onClick={() => setMenuOpen(false)} to="/" className="hover:text-red-500">
            Home
          </Link>

          {!auth ? (
            <>
              <Link onClick={() => setMenuOpen(false)} to="/login" className="hover:text-red-500">
                Login
              </Link>
              <Link onClick={() => setMenuOpen(false)} to="/register" className="hover:text-red-500">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-yellow-400">Hi, {auth.username}</span>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
