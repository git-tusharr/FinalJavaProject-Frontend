import { useState, useMemo } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SecurityIcon from "@mui/icons-material/Security";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import LockIcon from "@mui/icons-material/Lock";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

/* ── Brand tokens ── */
const T = {
  black:   "#080808",
  surface: "#111111",
  card:    "#141414",
  border:  "#1e1e1e",
  gold:    "#E9B949",
  goldHov: "#f5c84e",
  red:     "#D0312D",
  text:    "#e2e2e2",
  muted:   "#666666",
  green:   "#4ade80",
};
const SYNE = "'Syne', sans-serif";
const DM   = "'DM Sans', sans-serif";

const drawerWidth = 248;

/* ── Nav item definition ── */
const NAV_ITEMS = [
  {
    label: "Create Product",
    icon: <InventoryIcon fontSize="small" />,
    to: "/admin/sellerpannel",
  },
  {
    label: "Manage Orders",
    icon: <AssignmentIcon fontSize="small" />,
    to: "/admin/orders",
  },
];

const RBAC_ITEMS = [
  {
    label: "Roles",
    icon: <GroupIcon fontSize="small" />,
    to: "/admin/create/roles",
  },
  {
    label: "Permissions",
    icon: <LockIcon fontSize="small" />,
    to: "/admin/create/permissions",
  },
  {
    label: "Assign Roles",
    icon: <SecurityIcon fontSize="small" />,
    to: "/admin/assign-role",
  },
  {
    label: "RBAC Overview",
    icon: <DashboardIcon fontSize="small" />,
    to: "/admin/rbac/permissions",
  },
];

function NavItem({ item, collapsed, onClick }) {
  const location = useLocation();
  const active = location.pathname === item.to;

  return (
    <Box
      component={Link}
      to={item.to}
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: collapsed ? 0 : 1.5,
        justifyContent: collapsed ? "center" : "flex-start",
        px: collapsed ? 0 : 1.5,
        py: 1.1,
        borderRadius: "8px",
        textDecoration: "none",
        fontFamily: DM,
        fontSize: 13.5,
        fontWeight: active ? 600 : 400,
        color: active ? T.gold : T.muted,
        bgcolor: active ? "rgba(233,185,73,.07)" : "transparent",
        border: `1px solid ${active ? "rgba(233,185,73,.18)" : "transparent"}`,
        transition: "all .18s",
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "relative",
        "&:hover": {
          color: T.text,
          bgcolor: "rgba(255,255,255,.04)",
          borderColor: T.border,
        },
        ...(active && {
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0, top: "20%", bottom: "20%",
            width: "3px",
            borderRadius: "0 3px 3px 0",
            bgcolor: T.gold,
          },
        }),
      }}
    >
      <Box sx={{ color: active ? T.gold : T.muted, flexShrink: 0, display: "flex" }}>
        {item.icon}
      </Box>
      {!collapsed && item.label}
    </Box>
  );
}

function SectionLabel({ label, collapsed }) {
  if (collapsed) {
    return (
      <Box sx={{
        height: "1px",
        bgcolor: T.border,
        mx: 1,
        my: 1.5,
      }} />
    );
  }
  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: 1.5,
      px: 1.5, py: 0.5, mb: 0.5,
    }}>
      <Box sx={{ flex: 1, height: "1px", bgcolor: T.border }} />
      <Box sx={{
        fontFamily: SYNE,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "1.8px",
        textTransform: "uppercase",
        color: T.muted,
        flexShrink: 0,
      }}>
        {label}
      </Box>
      <Box sx={{ flex: 1, height: "1px", bgcolor: T.border }} />
    </Box>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [collapsed, setCollapsed]   = useState(false);
  const [mode, setMode]             = useState("light");

  const theme = useMemo(
    () => createTheme({ palette: { mode, primary: { main: "#1976d2" } } }),
    [mode]
  );

  const toggleDrawer  = () => setDrawerOpen((o) => !o);
  const toggleTheme   = () => setMode((p) => (p === "light" ? "dark" : "light"));
  const toggleCollapse = () => setCollapsed((c) => !c);

  /* Effective drawer width */
  const effectiveWidth = collapsed ? 64 : drawerWidth;

  /* Shared drawer content */
  const drawerContent = (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      bgcolor: T.surface,
      borderRight: `1px solid ${T.border}`,
    }}>
      {/* Sidebar brand header */}
      <Box sx={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        px: collapsed ? 0 : 2,
        borderBottom: `1px solid ${T.border}`,
        flexShrink: 0,
      }}>
        {!collapsed && (
          <Box sx={{
            fontFamily: SYNE,
            fontWeight: 800,
            fontSize: 15,
            color: T.text,
            letterSpacing: ".2px",
            "& em": { color: T.gold, fontStyle: "normal" },
          }}>
            Steal<em>Deals</em>
            <Box component="span" sx={{
              display: "block",
              fontFamily: DM,
              fontWeight: 400,
              fontSize: 10,
              letterSpacing: "1.6px",
              textTransform: "uppercase",
              color: T.muted,
              mt: "-2px",
            }}>
              Admin Panel
            </Box>
          </Box>
        )}
        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <Box
            component="button"
            onClick={toggleCollapse}
            sx={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 28, height: 28, borderRadius: "6px",
              bgcolor: "transparent",
              border: `1px solid ${T.border}`,
              color: T.muted, cursor: "pointer",
              transition: "all .2s",
              flexShrink: 0,
              "&:hover": { borderColor: T.gold, color: T.gold },
            }}
          >
            <ChevronLeftIcon sx={{
              fontSize: 16,
              transition: "transform .2s",
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
            }} />
          </Box>
        )}
        {/* Mobile close */}
        {isMobile && (
          <Box
            component="button"
            onClick={toggleDrawer}
            sx={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 28, height: 28, borderRadius: "6px",
              bgcolor: "transparent", border: `1px solid ${T.border}`,
              color: T.muted, cursor: "pointer",
              "&:hover": { borderColor: T.red, color: T.red },
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </Box>
        )}
      </Box>

      {/* Nav links */}
      <Box sx={{ flex: 1, overflowY: "auto", px: collapsed ? 1 : 1.5, pt: 2, pb: 1,
        scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" },
      }}>
        <SectionLabel label="Catalog" collapsed={collapsed} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: .5, mb: 1 }}>
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} item={item} collapsed={collapsed} onClick={isMobile ? toggleDrawer : undefined} />
          ))}
        </Box>

        <SectionLabel label="Access Control" collapsed={collapsed} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: .5 }}>
          {RBAC_ITEMS.map((item) => (
            <NavItem key={item.to} item={item} collapsed={collapsed} onClick={isMobile ? toggleDrawer : undefined} />
          ))}
        </Box>
      </Box>

      {/* Bottom actions */}
      <Box sx={{
        borderTop: `1px solid ${T.border}`,
        px: collapsed ? 1 : 1.5,
        py: 1.5,
        display: "flex",
        flexDirection: collapsed ? "column" : "row",
        gap: 1,
      }}>
        {/* Back to site */}
        <Box
          component="button"
          onClick={() => navigate("/")}
          sx={{
            flex: collapsed ? "none" : 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: .8,
            py: 1, px: 1.5,
            bgcolor: "transparent",
            border: `1px solid ${T.border}`,
            borderRadius: "7px",
            color: T.muted,
            fontFamily: DM, fontSize: 12, fontWeight: 500,
            cursor: "pointer",
            transition: "all .18s",
            "&:hover": { borderColor: T.gold, color: T.gold, bgcolor: "rgba(233,185,73,.05)" },
          }}
        >
          <HomeIcon sx={{ fontSize: 15 }} />
          {!collapsed && "Back to site"}
        </Box>

        {/* Theme toggle */}
        <Box
          component="button"
          onClick={toggleTheme}
          sx={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: collapsed ? "100%" : 36, height: 36,
            bgcolor: "transparent",
            border: `1px solid ${T.border}`,
            borderRadius: "7px",
            color: T.muted, cursor: "pointer",
            transition: "all .18s",
            "&:hover": { borderColor: T.gold, color: T.gold, bgcolor: "rgba(233,185,73,.05)" },
          }}
        >
          {mode === "dark"
            ? <LightModeIcon sx={{ fontSize: 15 }} />
            : <DarkModeIcon  sx={{ fontSize: 15 }} />}
        </Box>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: T.black, fontFamily: DM }}>

        {/* ── Top AppBar ── */}
        <Box sx={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 1300,
          height: 64,
          bgcolor: T.black,
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          px: 2,
          gap: 2,
          boxShadow: "0 2px 20px rgba(0,0,0,.6)",
        }}>
          {/* Hamburger (mobile) */}
          {isMobile && (
            <Box
              component="button"
              onClick={toggleDrawer}
              sx={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 36, height: 36,
                bgcolor: "transparent",
                border: `1px solid ${T.border}`,
                borderRadius: "7px",
                color: T.text, cursor: "pointer", flexShrink: 0,
                transition: "all .18s",
                "&:hover": { borderColor: T.gold, color: T.gold },
              }}
            >
              <MenuIcon sx={{ fontSize: 18 }} />
            </Box>
          )}

          {/* Title */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{
              fontFamily: SYNE,
              fontWeight: 800,
              fontSize: 16,
              color: T.text,
              lineHeight: 1,
            }}>
              Admin{" "}
              <Box component="span" sx={{ color: T.gold }}>Panel</Box>
            </Box>
            <Box sx={{
              fontFamily: DM,
              fontSize: 11,
              color: T.muted,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              mt: "2px",
            }}>
              StealDeals Management
            </Box>
          </Box>

          {/* Top gradient bar at bottom of appbar */}
          <Box sx={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: 2,
            background: `linear-gradient(90deg, ${T.red}, ${T.gold})`,
          }} />
        </Box>

        {/* ── Sidebar Drawer ── */}
        {isMobile ? (
          /* Mobile overlay */
          <>
            {drawerOpen && (
              <Box
                onClick={toggleDrawer}
                sx={{
                  position: "fixed", inset: 0, zIndex: 1200,
                  bgcolor: "rgba(0,0,0,.6)", backdropFilter: "blur(2px)",
                }}
              />
            )}
            <Box sx={{
              position: "fixed",
              top: 0, left: 0, bottom: 0,
              zIndex: 1250,
              width: drawerWidth,
              transform: drawerOpen ? "translateX(0)" : `translateX(-${drawerWidth}px)`,
              transition: "transform .25s cubic-bezier(.4,0,.2,1)",
            }}>
              {drawerContent}
            </Box>
          </>
        ) : (
          /* Desktop persistent */
          <Box sx={{
            position: "fixed",
            top: 0, left: 0, bottom: 0,
            zIndex: 1200,
            width: drawerOpen ? effectiveWidth : 0,
            overflow: "hidden",
            transition: "width .22s cubic-bezier(.4,0,.2,1)",
          }}>
            <Box sx={{ width: effectiveWidth }}>
              {drawerContent}
            </Box>
          </Box>
        )}

        {/* ── Main content ── */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: !isMobile && drawerOpen ? `${effectiveWidth}px` : 0,
            mt: "64px",
            p: { xs: 2, sm: 3 },
            transition: "margin-left .22s cubic-bezier(.4,0,.2,1)",
            minHeight: "calc(100vh - 64px)",
            display: "flex",
            justifyContent: "center",
            bgcolor: T.black,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 1200 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}