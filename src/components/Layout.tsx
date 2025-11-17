import { Box, IconButton, AppBar, Toolbar, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { SIDEBAR_WIDTH } from "./Sidebar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      
      <AppBar
        position="fixed"
        sx={{
          display: { xs: "flex", md: "none" },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
        }}
      >
        <Sidebar />
      </Box>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
          },
        }}
      >
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          marginTop: { xs: "64px", md: 0 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
