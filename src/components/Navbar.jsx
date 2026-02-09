import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Badge,
  TextField
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../services/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const doSearch = () => {
    navigate(`/search?q=${query}`);
  };

  const { cartCount, loadCartCount } = useCart();
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");

    loadCartCount();
    navigate("/login");
    window.location.reload();
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", gap: 2 }}>
        {/* Brand */}
        <Typography
          component={Link}
          to="/"
          variant="h6"
          sx={{ color: "white", textDecoration: "none", fontWeight: "bold" }}
        >
          ShopKart
        </Typography>

        {/* Search Box */}
        <Box sx={{ display: "flex", flexGrow: 1, gap: 1, maxWidth: 450 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search for products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ bgcolor: "white", borderRadius: 1 }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={doSearch}
            sx={{ whiteSpace: "nowrap" }}
          >
            Search
          </Button>
        </Box>

        {/* Right Side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {username ? (
            <>
              <Typography sx={{ color: "white", fontWeight: "bold" }}>
                👋 Hello, {username.split("@")[0]}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} color="inherit" to="/login">
                Sign In
              </Button>
              <Button component={Link} color="inherit" to="/register">
                Register
              </Button>
            </>
          )}


     {/* My Orders Button */}
      <Button
        component={Link}
        to="/orders/my"
        color="inherit"
      >
        My Orders
      </Button>


          {/* Cart */}
          <IconButton
            component={Link}
            to={`/cart/${userId}`}
            sx={{ color: "white" }}
          >
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
