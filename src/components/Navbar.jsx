import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LogoutIcon from "@mui/icons-material/Logout";
import { useCart } from "../services/CartContext";
import logo from "../assets/logo.png";

/* ─── Global styles injected once ─────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');

  :root {
    --sd-black:    #080808;
    --sd-surface:  #111111;
    --sd-border:   #1e1e1e;
    --sd-gold:     #E9B949;
    --sd-gold-hov: #f5c84e;
    --sd-red:      #D0312D;
    --sd-red-hov:  #a82825;
    --sd-text:     #e2e2e2;
    --sd-muted:    #6a6a6a;
    --sd-white:    #ffffff;
  }

  /* ── nav shell ── */
  .sd-nav {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: var(--sd-black);
    border-bottom: 1px solid var(--sd-border);
    box-shadow: 0 2px 24px rgba(0,0,0,.75);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── promo strip ── */
  .sd-strip {
    background: var(--sd-red);
    text-align: center;
    padding: 5px 16px;
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.6px;
    color: #fff;
    text-transform: uppercase;
    user-select: none;
  }

  /* ── main toolbar ── */
  .sd-toolbar {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 24px;
    height: 68px;
    display: flex;
    align-items: center;
    gap: 18px;
  }

  /* ── brand ── */
  .sd-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
  }
  .sd-logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
    transition: filter .3s, transform .3s;
    filter: drop-shadow(0 0 5px rgba(233,185,73,.2));
  }
  .sd-brand:hover .sd-logo {
    filter: drop-shadow(0 0 10px rgba(233,185,73,.5));
    transform: scale(1.05);
  }
  .sd-brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 21px;
    font-weight: 800;
    color: var(--sd-white);
    letter-spacing: .2px;
    line-height: 1;
  }
  .sd-brand-name em {
    color: var(--sd-gold);
    font-style: normal;
  }

  /* ── search ── */
  .sd-search {
    flex: 1;
    max-width: 520px;
    display: flex;
    align-items: center;
    background: var(--sd-surface);
    border: 1.5px solid var(--sd-border);
    border-radius: 8px;
    overflow: hidden;
    transition: border-color .2s, box-shadow .2s;
  }
  .sd-search:focus-within {
    border-color: var(--sd-gold);
    box-shadow: 0 0 0 3px rgba(233,185,73,.1);
  }
  .sd-search input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    outline: none;
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--sd-text);
  }
  .sd-search input::placeholder { color: var(--sd-muted); }
  .sd-search-btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--sd-gold);
    border: none;
    padding: 10px 18px;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .9px;
    color: #000;
    text-transform: uppercase;
    cursor: pointer;
    transition: background .2s;
  }
  .sd-search-btn:hover { background: var(--sd-gold-hov); }

  /* ── right actions ── */
  .sd-actions {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
    margin-left: auto;
  }

  /* generic nav pill */
  .sd-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: none;
    border-radius: 6px;
    padding: 8px 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--sd-muted);
    text-decoration: none;
    cursor: pointer;
    white-space: nowrap;
    transition: color .2s, background .2s;
  }
  .sd-pill:hover { color: var(--sd-text); background: rgba(255,255,255,.05); }
  .sd-pill .sd-lbl { /* hide label at mid-width via media query */ }

  /* outlined pill */
  .sd-pill-outline {
    border: 1px solid var(--sd-border);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .4px;
  }
  .sd-pill-outline:hover {
    border-color: var(--sd-red);
    color: var(--sd-red);
    background: rgba(208,49,45,.06);
  }

  /* register CTA */
  .sd-register {
    display: inline-flex;
    align-items: center;
    background: var(--sd-red);
    border: none;
    border-radius: 6px;
    padding: 9px 18px;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .9px;
    color: #fff;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    transition: background .2s, transform .15s;
  }
  .sd-register:hover { background: var(--sd-red-hov); transform: translateY(-1px); }

  /* greeting */
  .sd-greeting {
    font-size: 13px;
    font-weight: 500;
    color: var(--sd-muted);
    padding: 0 12px 0 6px;
    border-right: 1px solid var(--sd-border);
    white-space: nowrap;
  }
  .sd-greeting strong { color: var(--sd-gold); font-weight: 600; }

  .sd-divider {
    width: 1px;
    height: 22px;
    background: var(--sd-border);
    flex-shrink: 0;
    margin: 0 4px;
  }

  /* cart button */
  .sd-cart {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(233,185,73,.07);
    border: 1.5px solid rgba(233,185,73,.22);
    border-radius: 8px;
    padding: 8px 13px;
    color: var(--sd-gold);
    text-decoration: none;
    margin-left: 4px;
    transition: background .2s, border-color .2s, transform .15s;
  }
  .sd-cart:hover {
    background: rgba(233,185,73,.15);
    border-color: var(--sd-gold);
    transform: translateY(-1px);
  }

  /* ── hamburger ── */
  .sd-burger {
    display: none;
    background: transparent;
    border: 1px solid var(--sd-border);
    border-radius: 6px;
    padding: 6px 8px;
    color: var(--sd-text);
    cursor: pointer;
    flex-shrink: 0;
    margin-left: auto;
    align-items: center;
    justify-content: center;
    transition: border-color .2s;
  }
  .sd-burger:hover { border-color: var(--sd-gold); color: var(--sd-gold); }

  /* ── mobile drawer ── */
  .sd-drawer {
    display: none;
    flex-direction: column;
    gap: 8px;
    padding: 14px 20px 20px;
    background: var(--sd-surface);
    border-top: 1px solid var(--sd-border);
  }
  .sd-drawer.sd-open { display: flex; }

  .sd-mob-search {
    display: flex;
    background: var(--sd-black);
    border: 1.5px solid var(--sd-border);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 4px;
  }
  .sd-mob-search:focus-within { border-color: var(--sd-gold); }
  .sd-mob-search input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    outline: none;
    padding: 12px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--sd-text);
  }
  .sd-mob-search input::placeholder { color: var(--sd-muted); }
  .sd-mob-search button {
    background: var(--sd-gold);
    border: none;
    padding: 12px 16px;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .9px;
    color: #000;
    text-transform: uppercase;
    cursor: pointer;
  }

  .sd-drawer-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 7px;
    border: 1px solid var(--sd-border);
    background: rgba(255,255,255,.025);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--sd-muted);
    text-decoration: none;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: color .2s, background .2s;
  }
  .sd-drawer-row:hover { color: var(--sd-text); background: rgba(255,255,255,.06); }
  .sd-drawer-row.gold  { color: var(--sd-gold); border-color: rgba(233,185,73,.2); background: rgba(233,185,73,.05); }
  .sd-drawer-row.danger { color: var(--sd-red); border-color: rgba(208,49,45,.2); background: rgba(208,49,45,.05); }

  .sd-drawer-badge {
    margin-left: auto;
    background: var(--sd-red);
    color: #fff;
    border-radius: 20px;
    padding: 2px 9px;
    font-size: 11px;
    font-weight: 700;
  }

  .sd-drawer-hello {
    padding: 10px 14px;
    border-radius: 7px;
    border: 1px solid rgba(233,185,73,.18);
    background: rgba(233,185,73,.05);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--sd-gold);
  }

  .sd-drawer-register {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 13px;
    border-radius: 7px;
    background: var(--sd-red);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background .2s;
  }
  .sd-drawer-register:hover { background: var(--sd-red-hov); }

  /* ── Responsive breakpoints ── */
  @media (max-width: 960px) {
    .sd-search { max-width: 360px; }
    .sd-pill .sd-lbl { display: none; }
    .sd-greeting { display: none; }
  }

  @media (max-width: 700px) {
    .sd-search   { display: none; }
    .sd-actions  { display: none; }
    .sd-burger   { display: inline-flex; }
    .sd-mob-cart { display: inline-flex !important; }
  }

  @media (max-width: 380px) {
    .sd-brand-name { font-size: 17px; }
    .sd-logo { width: 34px; height: 34px; }
    .sd-toolbar { padding: 0 14px; }
  }
`;

function StyleTag() {
  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}

export default function Navbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  const { cartCount, loadCartCount } = useCart();
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  const displayName = username ? username.split("@")[0] : "";

  const doSearch = (q) => {
    const term = (q ?? query).trim();
    if (term) {
      navigate(`/search?q=${term}`);
      setDrawerOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    loadCartCount();
    navigate("/login");
    window.location.reload();
  };

  /* Close drawer when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setDrawerOpen(false);
      }
    };
    if (drawerOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [drawerOpen]);

  return (
    <>
      <StyleTag />

      <header className="sd-nav" ref={drawerRef}>

        {/* ── Promo strip ── */}
        <div className="sd-strip">
          🔥&nbsp; Steal the deal — new offers every day!
        </div>

        {/* ── Main toolbar ── */}
        <div className="sd-toolbar">

          {/* Brand */}
          <Link to="/" className="sd-brand">
            <img src={logo} alt="StealDeals" className="sd-logo" />
            <span className="sd-brand-name">
              Steal<em>Deals</em>
            </span>
          </Link>

          {/* Desktop search */}
          <div className="sd-search">
            <input
              placeholder="Search for deals..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
            />
            <button className="sd-search-btn" onClick={() => doSearch()}>
              <SearchIcon style={{ fontSize: 15 }} />
              Search
            </button>
          </div>

          {/* Desktop actions */}
          <div className="sd-actions">
            {username ? (
              <>
                <span className="sd-greeting">
                  Hi,&nbsp;<strong>{displayName}</strong>
                </span>
                <Link to="/orders/my" className="sd-pill">
                  <ReceiptLongIcon style={{ fontSize: 17 }} />
                  <span className="sd-lbl">My Orders</span>
                </Link>
                <button
                  className="sd-pill sd-pill-outline"
                  onClick={handleLogout}
                >
                  <LogoutIcon style={{ fontSize: 16 }} />
                  <span className="sd-lbl">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="sd-pill">
                  <PersonOutlineIcon style={{ fontSize: 17 }} />
                  <span className="sd-lbl">Sign In</span>
                </Link>
                <Link to="/register" className="sd-register">
                  Register
                </Link>
              </>
            )}

            <div className="sd-divider" />

            <Link to={`/cart/${userId}`} className="sd-cart">
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon style={{ fontSize: 22 }} />
              </Badge>
            </Link>
          </div>

          {/* Mobile: visible cart icon + hamburger */}
          <Link
            to={`/cart/${userId}`}
            className="sd-cart sd-mob-cart"
            style={{ display: "none" }}
          >
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon style={{ fontSize: 22 }} />
            </Badge>
          </Link>

          <button
            className="sd-burger"
            onClick={() => setDrawerOpen((o) => !o)}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
          >
            {drawerOpen
              ? <CloseIcon style={{ fontSize: 22 }} />
              : <MenuIcon style={{ fontSize: 22 }} />}
          </button>
        </div>

        {/* ── Mobile drawer ── */}
        <nav className={`sd-drawer${drawerOpen ? " sd-open" : ""}`}>

          {/* Mobile search */}
          <div className="sd-mob-search">
            <input
              placeholder="Search for deals..."
              value={mobileQuery}
              onChange={(e) => setMobileQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch(mobileQuery)}
            />
            <button onClick={() => doSearch(mobileQuery)}>Search</button>
          </div>

          {/* My Orders */}
          <Link
            to="/orders/my"
            className="sd-drawer-row"
            onClick={() => setDrawerOpen(false)}
          >
            <ReceiptLongIcon style={{ fontSize: 18 }} />
            My Orders
          </Link>

          {/* Cart */}
          <Link
            to={`/cart/${userId}`}
            className="sd-drawer-row gold"
            onClick={() => setDrawerOpen(false)}
          >
            <ShoppingCartIcon style={{ fontSize: 18 }} />
            Cart
            {cartCount > 0 && (
              <span className="sd-drawer-badge">{cartCount}</span>
            )}
          </Link>

          {/* Auth */}
          {username ? (
            <>
              <div className="sd-drawer-hello">
                👋 Hello, <strong>{displayName}</strong>
              </div>
              <button
                className="sd-drawer-row danger"
                onClick={() => { handleLogout(); setDrawerOpen(false); }}
              >
                <LogoutIcon style={{ fontSize: 18 }} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="sd-drawer-row"
                onClick={() => setDrawerOpen(false)}
              >
                <PersonOutlineIcon style={{ fontSize: 18 }} />
                Sign In
              </Link>
              <Link
                to="/register"
                className="sd-drawer-register"
                onClick={() => setDrawerOpen(false)}
              >
                Create Account
              </Link>
            </>
          )}
        </nav>

      </header>
    </>
  );
}