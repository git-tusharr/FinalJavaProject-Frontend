import { useState, useMemo } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Box, CssBaseline, Tooltip } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// Icons
import MenuIcon        from "@mui/icons-material/Menu";
import DashboardIcon   from "@mui/icons-material/Dashboard";
import InventoryIcon   from "@mui/icons-material/Inventory";
import AssignmentIcon  from "@mui/icons-material/Assignment";
import SecurityIcon    from "@mui/icons-material/Security";
import HomeIcon        from "@mui/icons-material/Home";
import GroupIcon       from "@mui/icons-material/Group";
import LockIcon        from "@mui/icons-material/Lock";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import StorefrontIcon  from "@mui/icons-material/Storefront";

/* ── Brand tokens ── */
const T = {
  black:   "#080808",
  surface: "#0e0e0e",
  card:    "#141414",
  border:  "#1e1e1e",
  gold:    "#E9B949",
  goldHov: "#f5c84e",
  goldDim: "rgba(233,185,73,.08)",
  goldRim: "rgba(233,185,73,.18)",
  red:     "#D0312D",
  redDim:  "rgba(208,49,45,.1)",
  redRim:  "rgba(208,49,45,.3)",
  text:    "#e2e2e2",
  muted:   "#555555",
  muted2:  "#888888",
};

const SYNE = "'Syne', sans-serif";
const DM   = "'DM Sans', sans-serif";

const DRAWER_FULL = 260;
const DRAWER_MINI = 68;

/* ── Role helpers (single source of truth) ── */
const ROLE_PRIORITY = ["SUPER_ADMIN", "ADMIN", "SELLER", "USER"];
const ROLE_LABELS   = {
  SUPER_ADMIN: "Super Admin",
  ADMIN:       "Admin",
  SELLER:      "Seller",
  USER:        "User",
};
const ROLE_BADGE = {
  SUPER_ADMIN: "Super Admin",
  ADMIN:       "Admin",
  SELLER:      "Seller",
  USER:        "User",
};

function getTopRole() {
  try {
    const raw  = localStorage.getItem("roles");
    const arr  = raw ? JSON.parse(raw) : [];
    return ROLE_PRIORITY.find((r) => arr.includes(r)) || arr[0] || "USER";
  } catch {
    return "USER";
  }
}

/* ── Nav structure ── */
const NAV = [
  {
    section: "Store",
    items: [
      { label: "Create Product", icon: <InventoryIcon  sx={{ fontSize: 18 }} />, to: "/admin/sellerpannel" },
      { label: "Manage Orders",  icon: <AssignmentIcon sx={{ fontSize: 18 }} />, to: "/admin/orders"       },
    ],
  },
  {
    section: "Access Control",
    items: [
      { label: "Roles",         icon: <GroupIcon    sx={{ fontSize: 18 }} />, to: "/admin/create/roles"      },
      { label: "Permissions",   icon: <LockIcon     sx={{ fontSize: 18 }} />, to: "/admin/create/permissions"},
      { label: "Assign Roles",  icon: <SecurityIcon sx={{ fontSize: 18 }} />, to: "/admin/assign-role"       },
      { label: "RBAC Overview", icon: <DashboardIcon sx={{ fontSize: 18 }} />,to: "/admin/rbac/permissions"  },
    ],
  },
];

/* ─── NavItem ── */
function NavItem({ item, mini, onClick }) {
  const { pathname } = useLocation();
  const active = pathname === item.to || pathname.startsWith(item.to + "/");

  const inner = (
    <Box
      component={Link}
      to={item.to}
      onClick={onClick}
      sx={{
        display: "flex", alignItems: "center",
        gap: 1.4,
        px: mini ? 0 : 1.6,
        py: 1.05,
        borderRadius: "10px",
        textDecoration: "none",
        fontFamily: DM, fontSize: 13.5,
        fontWeight: active ? 600 : 400,
        color: active ? "#fff" : T.muted2,
        bgcolor: active ? T.goldDim : "transparent",
        border: `1px solid ${active ? T.goldRim : "transparent"}`,
        justifyContent: mini ? "center" : "flex-start",
        position: "relative", transition: "all .17s ease", overflow: "hidden",
        "&::after": active ? {
          content: '""',
          position: "absolute",
          left: 0, top: "18%", bottom: "18%", width: "3px",
          borderRadius: "0 3px 3px 0",
          background: `linear-gradient(180deg, ${T.gold}, ${T.goldHov})`,
        } : {},
        "&:hover": { color: T.text, bgcolor: "rgba(255,255,255,.04)", borderColor: T.border },
      }}
    >
      <Box sx={{ color: active ? T.gold : T.muted, display: "flex", flexShrink: 0, transition: "color .17s" }}>
        {item.icon}
      </Box>
      {!mini && <Box sx={{ lineHeight: 1.2 }}>{item.label}</Box>}
      {active && !mini && (
        <Box sx={{
          ml: "auto", flexShrink: 0,
          width: 6, height: 6, borderRadius: "50%",
          bgcolor: T.gold, boxShadow: `0 0 8px ${T.gold}`,
        }} />
      )}
    </Box>
  );

  return mini ? (
    <Tooltip title={item.label} placement="right" arrow>{inner}</Tooltip>
  ) : inner;
}

/* ─── Sidebar ── */
function Sidebar({ mini, onToggle, isMobile, onClose }) {
  const navigate = useNavigate();

  /* User info */
  const username     = localStorage.getItem("username") || "";
  const displayName  = username ? username.split("@")[0] : "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  /* Role */
  const topRole  = getTopRole();
  const roleLabel = ROLE_LABELS[topRole]  || topRole;
  const roleBadge = ROLE_BADGE[topRole]   || topRole;
  const isSuperAdmin = topRole === "SUPER_ADMIN";

  return (
    <Box sx={{
      width: mini ? DRAWER_MINI : DRAWER_FULL,
      height: "100%",
      display: "flex", flexDirection: "column",
      bgcolor: T.surface,
      borderRight: `1px solid ${T.border}`,
      transition: "width .22s cubic-bezier(.4,0,.2,1)",
      overflow: "hidden", position: "relative",
      "&::after": {
        content: '""', position: "absolute",
        top: 0, right: 0, bottom: 0, width: "1px",
        background: `linear-gradient(180deg, transparent, rgba(233,185,73,.12) 40%, transparent)`,
        pointerEvents: "none",
      },
    }}>

      {/* ── Logo header ── */}
      <Box sx={{
        height: 64, flexShrink: 0,
        display: "flex", alignItems: "center",
        justifyContent: mini ? "center" : "space-between",
        px: mini ? 0 : 2.2,
        borderBottom: `1px solid ${T.border}`,
        position: "relative", overflow: "hidden",
      }}>
        {/* Glow blob */}
        <Box sx={{
          position: "absolute", top: -20, left: -10,
          width: 120, height: 80, borderRadius: "50%",
          bgcolor: "rgba(233,185,73,.04)", filter: "blur(20px)", pointerEvents: "none",
        }} />

        {/* Full logo */}
        {!mini && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, zIndex: 1 }}>
            <Box sx={{
              width: 32, height: 32, borderRadius: "8px", bgcolor: T.gold,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 16px rgba(233,185,73,.3)`, flexShrink: 0,
            }}>
              <StorefrontIcon sx={{ fontSize: 17, color: "#000" }} />
            </Box>
            <Box>
              <Box sx={{
                fontFamily: SYNE, fontWeight: 800, fontSize: 14, color: "#fff", lineHeight: 1,
                "& em": { color: T.gold, fontStyle: "normal" },
              }}>
                Steal<em>Deals</em>
              </Box>
              <Box sx={{
                fontFamily: DM, fontSize: 9.5, color: T.muted,
                letterSpacing: "1.8px", textTransform: "uppercase", mt: "2px",
              }}>
                {roleLabel} Console
              </Box>
            </Box>
          </Box>
        )}

        {/* Mini logo */}
        {mini && (
          <Box sx={{
            width: 34, height: 34, borderRadius: "9px", bgcolor: T.gold,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 14px rgba(233,185,73,.25)`,
          }}>
            <StorefrontIcon sx={{ fontSize: 17, color: "#000" }} />
          </Box>
        )}

        {/* Collapse toggle — desktop only */}
        {!isMobile && (
          <Tooltip title={mini ? "Expand" : "Collapse"} placement="right">
            <Box
              component="button" onClick={onToggle}
              sx={{
                zIndex: 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 26, height: 26, borderRadius: "6px",
                bgcolor: T.card, border: `1px solid ${T.border}`,
                color: T.muted, cursor: "pointer", flexShrink: 0, transition: "all .18s",
                "&:hover": { borderColor: T.gold, color: T.gold, bgcolor: T.goldDim },
              }}
            >
              <ChevronLeftIcon sx={{
                fontSize: 15, transition: "transform .22s",
                transform: mini ? "rotate(180deg)" : "rotate(0deg)",
              }} />
            </Box>
          </Tooltip>
        )}
      </Box>

      {/* ── Nav items ── */}
      <Box sx={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        px: mini ? 1 : 1.6, pt: 2, pb: 1,
        scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" },
      }}>
        {NAV.map((group) => (
          <Box key={group.section} sx={{ mb: 2.5 }}>
            {!mini ? (
              <Box sx={{
                fontFamily: SYNE, fontSize: 9, fontWeight: 700,
                letterSpacing: "2px", textTransform: "uppercase",
                color: T.muted, px: 1.6, mb: 1,
              }}>
                {group.section}
              </Box>
            ) : (
              <Box sx={{ height: "1px", bgcolor: T.border, mb: 1.5, mx: .5 }} />
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: .5 }}>
              {group.items.map((item) => (
                <NavItem
                  key={item.to} item={item} mini={mini}
                  onClick={isMobile ? onClose : undefined}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {/* ── User footer ── */}
      <Box sx={{
        borderTop: `1px solid ${T.border}`,
        p: mini ? 1 : 1.8, flexShrink: 0,
        bgcolor: "rgba(0,0,0,.25)",
      }}>
        {mini ? (
          /* Mini mode — avatar + home stacked */
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
            <Tooltip title={`${displayName} · ${roleLabel}`} placement="right">
              <Box sx={{
                width: 34, height: 34, borderRadius: "9px",
                background: `linear-gradient(135deg, ${T.gold}, ${T.goldHov})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: SYNE, fontWeight: 800, fontSize: 14, color: "#000", cursor: "default",
              }}>
                {avatarLetter}
              </Box>
            </Tooltip>
            <Tooltip title="Back to site" placement="right">
              <Box
                component="button" onClick={() => navigate("/")}
                sx={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 34, height: 34, borderRadius: "9px",
                  bgcolor: "transparent", border: `1px solid ${T.border}`,
                  color: T.muted, cursor: "pointer", transition: "all .18s",
                  "&:hover": { borderColor: T.gold, color: T.gold, bgcolor: T.goldDim },
                }}
              >
                <HomeIcon sx={{ fontSize: 16 }} />
              </Box>
            </Tooltip>
          </Box>
        ) : (
          /* Full mode — user card + back button */
          <Box>
            <Box sx={{
              display: "flex", alignItems: "center", gap: 1.4,
              p: 1.2, borderRadius: "10px",
              bgcolor: T.card, border: `1px solid ${T.border}`, mb: 1.2,
            }}>
              {/* Avatar */}
              <Box sx={{
                width: 34, height: 34, borderRadius: "9px",
                background: `linear-gradient(135deg, ${T.gold}, ${T.goldHov})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: SYNE, fontWeight: 800, fontSize: 14, color: "#000", flexShrink: 0,
                boxShadow: `0 4px 12px rgba(233,185,73,.2)`,
              }}>
                {avatarLetter}
              </Box>

              {/* Name + role label */}
              <Box sx={{ minWidth: 0 }}>
                <Box sx={{
                  fontFamily: DM, fontWeight: 600, fontSize: 13, color: T.text, lineHeight: 1.2,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {displayName}
                </Box>
                <Box sx={{ fontFamily: DM, fontSize: 10.5, color: T.muted, letterSpacing: ".4px" }}>
                  {roleLabel}
                </Box>
              </Box>

              {/* Role badge — red for Super Admin, gold for others */}
              <Box sx={{
                ml: "auto", flexShrink: 0,
                px: 1, py: .3, borderRadius: "5px",
                bgcolor: isSuperAdmin ? T.redDim : T.goldDim,
                border: `1px solid ${isSuperAdmin ? T.redRim : T.goldRim}`,
                fontFamily: SYNE, fontWeight: 700, fontSize: 9,
                letterSpacing: "1px", textTransform: "uppercase",
                color: isSuperAdmin ? T.red : T.gold,
                whiteSpace: "nowrap",
              }}>
                {roleBadge}
              </Box>
            </Box>

            {/* Back to site */}
            <Box
              component="button" onClick={() => navigate("/")}
              sx={{
                width: "100%", display: "flex", alignItems: "center",
                justifyContent: "center", gap: 1, py: 1, px: 1.5,
                borderRadius: "9px", bgcolor: "transparent",
                border: `1px solid ${T.border}`, color: T.muted2,
                fontFamily: DM, fontSize: 12.5, fontWeight: 500, cursor: "pointer",
                transition: "all .18s",
                "&:hover": {
                  borderColor: T.gold, color: T.gold,
                  bgcolor: T.goldDim, boxShadow: `0 0 20px rgba(233,185,73,.07)`,
                },
              }}
            >
              <HomeIcon sx={{ fontSize: 15 }} />
              Back to Site
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

/* ─── TopBar ── */
function TopBar({ onMenuClick, isMobile }) {
  const { pathname } = useLocation();

  /* Derive page title from active route */
  const allItems  = NAV.flatMap((g) => g.items);
  const activeItem = allItems.find((i) => pathname.startsWith(i.to));
  const pageTitle  = activeItem?.label ?? "Dashboard";

  /* Dynamic role label for breadcrumb */
  const topRole   = getTopRole();
  const roleLabel = ROLE_LABELS[topRole] || topRole;

  return (
    <Box sx={{
      position: "fixed", top: 0, left: 0, right: 0,
      height: 64, zIndex: 1300,
      bgcolor: "rgba(8,8,8,.9)", backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${T.border}`,
      display: "flex", alignItems: "center",
      px: { xs: 2, sm: 3 }, gap: 2,
    }}>
      {/* Shimmer accent line */}
      <Box sx={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "1.5px",
        background: `linear-gradient(90deg, transparent 0%, ${T.gold} 30%, ${T.goldHov} 60%, transparent 100%)`,
        opacity: .5,
      }} />

      {/* Hamburger — mobile only */}
      {isMobile && (
        <Box
          component="button" onClick={onMenuClick}
          sx={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 38, height: 38, borderRadius: "9px",
            bgcolor: T.card, border: `1px solid ${T.border}`,
            color: T.text, cursor: "pointer", flexShrink: 0, transition: "all .18s",
            "&:hover": { borderColor: T.gold, color: T.gold },
          }}
        >
          <MenuIcon sx={{ fontSize: 19 }} />
        </Box>
      )}

      {/* Page title + breadcrumb */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{
            fontFamily: SYNE, fontWeight: 800,
            fontSize: { xs: 14, sm: 16 }, color: "#fff", whiteSpace: "nowrap",
          }}>
            {pageTitle}
          </Box>
          <Box sx={{
            width: 5, height: 5, borderRadius: "50%",
            bgcolor: T.gold, flexShrink: 0, boxShadow: `0 0 8px ${T.gold}`,
          }} />
        </Box>
        {/* Breadcrumb — uses dynamic roleLabel instead of hardcoded "Admin" */}
        <Box sx={{
          fontFamily: DM, fontSize: 11, color: T.muted,
          letterSpacing: ".8px", textTransform: "uppercase",
          display: { xs: "none", sm: "block" },
        }}>
          {roleLabel} / {pageTitle}
        </Box>
      </Box>

      {/* Live badge */}
      <Box sx={{
        display: { xs: "none", md: "flex" },
        alignItems: "center", gap: .8,
        px: 1.6, py: .7, borderRadius: "8px",
        bgcolor: T.goldDim, border: `1px solid ${T.goldRim}`,
      }}>
        <Box sx={{
          width: 6, height: 6, borderRadius: "50%",
          bgcolor: T.gold, boxShadow: `0 0 6px ${T.gold}`,
          animation: "sdPulse 2s infinite",
          "@keyframes sdPulse": {
            "0%, 100%": { opacity: 1 },
            "50%":       { opacity: .4 },
          },
        }} />
        <Box sx={{
          fontFamily: SYNE, fontWeight: 700, fontSize: 10,
          letterSpacing: "1.5px", textTransform: "uppercase", color: T.gold,
        }}>
          Live
        </Box>
      </Box>
    </Box>
  );
}

/* ─── AdminLayout (root) ── */
export default function AdminLayout() {
  const isMobile = useMediaQuery("(max-width:900px)");

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mini, setMini]             = useState(false);
  const [mode]                      = useState("dark");

  const theme = useMemo(
    () => createTheme({ palette: { mode, primary: { main: T.gold } } }),
    [mode]
  );

  const effectiveWidth = !drawerOpen ? 0 : mini ? DRAWER_MINI : DRAWER_FULL;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
      `}</style>

      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: T.black, fontFamily: DM }}>

        {/* ── Desktop sidebar ── */}
        {!isMobile && (
          <Box sx={{
            position: "fixed", top: 0, left: 0, bottom: 0,
            zIndex: 1200,
            width: effectiveWidth,
            transition: "width .22s cubic-bezier(.4,0,.2,1)",
            overflow: "hidden", flexShrink: 0,
          }}>
            <Sidebar mini={mini} onToggle={() => setMini((m) => !m)} isMobile={false} />
          </Box>
        )}

        {/* ── Mobile overlay drawer ── */}
        {isMobile && drawerOpen && (
          <>
            <Box
              onClick={() => setDrawerOpen(false)}
              sx={{
                position: "fixed", inset: 0, zIndex: 1200,
                bgcolor: "rgba(0,0,0,.75)", backdropFilter: "blur(6px)",
              }}
            />
            <Box sx={{
              position: "fixed", top: 0, left: 0, bottom: 0,
              zIndex: 1250, width: DRAWER_FULL,
              boxShadow: "8px 0 48px rgba(0,0,0,.7)",
            }}>
              <Sidebar
                mini={false} onToggle={() => {}}
                isMobile={true} onClose={() => setDrawerOpen(false)}
              />
            </Box>
          </>
        )}

        {/* ── Top bar ── */}
        <TopBar
          onMenuClick={() => setDrawerOpen((o) => !o)}
          isMobile={isMobile}
        />

        {/* ── Main content ── */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: !isMobile ? `${effectiveWidth}px` : 0,
            mt: "64px",
            minHeight: "calc(100vh - 64px)",
            transition: "margin-left .22s cubic-bezier(.4,0,.2,1)",
            p: { xs: 2, sm: 3, md: 4 },
            background: `
              radial-gradient(ellipse at 80% 0%, rgba(233,185,73,.04) 0%, transparent 50%),
              radial-gradient(ellipse at 10% 90%, rgba(208,49,45,.03) 0%, transparent 50%),
              ${T.black}
            `,
          }}
        >
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Outlet />
          </Box>
        </Box>

      </Box>
    </ThemeProvider>
  );
}