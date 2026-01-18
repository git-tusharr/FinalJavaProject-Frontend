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











// import { Link } from "react-router-dom";
// import { useState } from "react";
// import { useAuth } from "../api/AuthContext"; // ✅ import AuthContext
// import logo1 from "../assets/images/logo1.png";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const { auth, logout } = useAuth(); // ✅ get auth info and logout

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

//           {!auth ? (
//             <>
//               <Link to="/login" className="hover:text-red-500 transition">Login</Link>
//               <Link to="/register" className="hover:text-red-500 transition">Register</Link>
//             </>
//           ) : (
//             <>
//               <span className="text-yellow-400">Hi, {auth.username}</span>
//               <button
//                 onClick={logout}
//                 className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold transition"
//               >
//                 Logout
//               </button>
//             </>
//           )}
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

//           {!auth ? (
//             <>
//               <Link onClick={() => setMenuOpen(false)} to="/login" className="hover:text-red-500">
//                 Login
//               </Link>
//               <Link onClick={() => setMenuOpen(false)} to="/register" className="hover:text-red-500">
//                 Register
//               </Link>
//             </>
//           ) : (
//             <>
//               <span className="text-yellow-400">Hi, {auth.username}</span>
//               <button
//                 onClick={() => { logout(); setMenuOpen(false); }}
//                 className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold transition"
//               >
//                 Logout
//               </button>
//             </>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// }





import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../api/AuthContext";
import UserMenu from "./UserMenu";
import { countCartItems } from "../services/CartService";
import { FaShoppingCart } from "react-icons/fa";
import logo1 from "../assets/images/logo1.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  // 🔄 Load cart count for badge
  const loadCartCount = async () => {
    if (!auth) return;
    try {
      const res = await countCartItems(auth.userId);
      setCartCount(res.data); // assuming backend returns just the count
    } catch (err) {
      console.error("Failed to fetch cart count:", err);
    }
  };

  // Load cart count on auth change
  useEffect(() => {
    if (auth) loadCartCount();
  }, [auth]);

  // Update cart count every 10s (optional, keeps badge live)
  useEffect(() => {
    const interval = setInterval(() => {
      if (auth) loadCartCount();
    }, 10000);
    return () => clearInterval(interval);
  }, [auth]);

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-red-600">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo */}
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
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className="text-white hover:text-red-500 transition"
          >
            Home
          </Link>

          {!auth ? (
            <>
              <Link
                to="/login"
                className="text-white hover:text-red-500 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-white hover:text-red-500 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <UserMenu />
              {/* Cart Icon */}
              <button
                onClick={() => navigate("/cart")}
                className="relative text-white hover:text-yellow-400 transition"
                aria-label="Cart"
              >
                <FaShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-red-600 px-6 py-6 space-y-4 text-sm">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block text-white hover:text-red-500 transition"
          >
            Home
          </Link>

          {!auth ? (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-white hover:text-red-500 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block text-white hover:text-red-500 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="border-t border-gray-800 pt-4 space-y-3">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-white">
                  {auth.username[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-white">
                  {auth.username}
                </span>
              </div>

              {/* Cart link */}
              <button
                onClick={() => {
                  navigate("/cart");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 py-2 rounded-lg font-semibold text-black transition"
              >
                <FaShoppingCart /> Cart ({cartCount})
              </button>

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold text-white transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
