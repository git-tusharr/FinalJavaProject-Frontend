import { useState, useMemo } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
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

const drawerWidth = 240;

export default function AdminLayout() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [mode, setMode] = useState("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#1976d2",
          },
        },
      }),
    [mode]
  );

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const toggleTheme = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  const drawerContent = (
    <>
      <Toolbar />
      <Divider />
      <List>
        <ListItemButton component={Link} to="/admin/sellerpannel">
          <ListItemIcon><InventoryIcon /></ListItemIcon>
          <ListItemText primary="Create Product" />
        </ListItemButton>

        <ListItemButton component={Link} to="/admin/orders">
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="Manage Orders" />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />

        <ListItemButton component={Link} to="/admin/create/roles">
          <ListItemIcon><GroupIcon /></ListItemIcon>
          <ListItemText primary="Roles" />
        </ListItemButton>

        <ListItemButton component={Link} to="/admin/create/permissions">
          <ListItemIcon><LockIcon /></ListItemIcon>
          <ListItemText primary="Permissions" />
        </ListItemButton>

        <ListItemButton component={Link} to="/admin/assign-role">
          <ListItemIcon><SecurityIcon /></ListItemIcon>
          <ListItemText primary="Assign Roles" />
        </ListItemButton>

        <ListItemButton component={Link} to="/admin/rbac/permissions">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="RBAC Overview" />
        </ListItemButton>
      </List>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ display: "flex" }}>
        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{
            zIndex: 1201,
            ml: !isMobile && drawerOpen ? `${drawerWidth}px` : 0,
          }}
        >
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Admin Panel
            </Typography>

            {/* Theme toggle */}
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Back to site */}
            <IconButton color="inherit" onClick={() => navigate("/")}>
              <HomeIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Drawer */}
        <Drawer
          variant={isMobile ? "temporary" : "persistent"}
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            mt: 8,
            p: 3,
            display: "flex",
            justifyContent: "center",
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
