import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material"; 

export default function Layout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}> 
      
      <Sidebar />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          padding: 3, 
        }}
      >
        <Outlet />
      </Box>

    </Box>
  );
}