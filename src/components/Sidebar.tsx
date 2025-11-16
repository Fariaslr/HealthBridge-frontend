import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Avatar,
    Typography,
    IconButton
} from "@mui/material";

import {
    Dashboard,
    FitnessCenter,
    LocalDining,
    MedicalServices,
    AccountCircle,
    ExitToApp,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const SIDEBAR_WIDTH = 220;

const sidebarItems = [
    { name: "Dashboard", icon: <Dashboard />, path: "/home" },
    { name: "Avaliações", icon: <MedicalServices />, path: "/avaliacao" },
    { name: "Treinos", icon: <FitnessCenter />, path: "/treino" },
    { name: "Dietas", icon: <LocalDining />, path: "/dieta" },
    { name: "Perfil", icon: <AccountCircle />, path: "/perfil" },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { usuario, setUsuario } = useAuth();

    return (
        <Box
            sx={{
        width: SIDEBAR_WIDTH,
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        bgcolor: "background.paper",
        borderRight: "1px solid #e0e0e0",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    }}
        >
            <Box sx={{ textAlign: "center", mb: 2, paddingTop: 2 }}>
                <img
                    src="/src/assets/logo.png"
                    alt="Logo"
                    style={{ width: "35%", height: "auto" }}
                />
            </Box>

            <Box sx={{ borderBottom: "1px solid #e0e0e0", mx: 2, mb: 1 }} />

            {/* MENU */}
            <List sx={{ flexGrow: 1 }}>
                {sidebarItems.map((item) => {
                    const isActive =
                        location.pathname.includes(item.path) && item.path !== "/home"
                            ? location.pathname.startsWith(item.path)
                            : location.pathname === item.path;

                    return (
                        <ListItem key={item.name} disablePadding>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                selected={isActive}
                                sx={{
                                    borderLeft: isActive
                                        ? "4px solid #1976d2"
                                        : "4px solid transparent",
                                    fontWeight: isActive ? "bold" : "normal",
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 35 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box
                sx={{
                    borderTop: "1px solid #e0e0e0",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                    maxWidth: "100%",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    minWidth: 0,
                }}
            >
                <Avatar
                    src={""}
                    alt={usuario?.nome || "User"}
                    sx={{ width: 36, height: 36 }}
                />

                <Box sx={{ flexGrow: 1 }}>
                    <Typography style={{ maxWidth: "120px" }} noWrap variant="body2" fontWeight={600}>
                        {usuario?.nome || "Usuário"}
                    </Typography>
                </Box>

                <IconButton
                    color="error"
                    size="small"
                    onClick={() => setUsuario(null)}
                    sx={{
                        minWidth: 10,
                        width: 10,
                        height: 10,
                        flexShrink: 0,
                    }}
                >
                    <ExitToApp fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}
