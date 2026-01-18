// src/components/UserMenu.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";
import { FaHeart } from "react-icons/fa";
import { countWishlistItems } from "../services/WishlistService";

export default function UserMenu() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch wishlist count
  useEffect(() => {
    if (auth) {
      countWishlistItems(auth.userId)
        .then((count) => setWishlistCount(count))
        .catch(() => setWishlistCount(0));
    }
  }, [auth]);

  if (!auth) return null;

  const initials = auth.username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full px-3 py-2 hover:bg-gray-800 transition"
      >
        <div className="h-9 w-9 rounded-full bg-red-600 flex items-center justify-center text-sm font-bold">
          {initials}
        </div>

        <span className="hidden lg:block text-sm font-medium text-white">
          {auth.username}
        </span>

        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
          {/* Profile Link */}
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-3 text-sm gap-2 hover:bg-gray-800 transition"
          >
            Profile
          </Link>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-3 text-sm gap-2 hover:bg-gray-800 transition"
          >
            <FaHeart className="text-red-500" /> Wishlist
            {wishlistCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              setOpen(false);
              navigate("/");
            }}
            className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
