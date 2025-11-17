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


export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { usuario, setUsuario } = useAuth();

    return (
        <Box
            sx={{
                width: SIDEBAR_WIDTH,
                height: "100vh",
                bgcolor: "background.paper",
                borderRight: "1px solid #e0e0e0",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: { md: "fixed", xs: "relative" }, 
                left: 0,
                top: 0,
            }}
        >
            {/* topo */}
            <Box sx={{ textAlign: "center", pt: 2 }}>
                <img
                    src="/src/assets/logo.png"
                    alt="Logo"
                    style={{ width: "35%" }}
                />
            </Box>

            <List sx={{ flexGrow: 1 }}>
                {sidebarItems.map((item) => {
                    const isActive =
                        location.pathname.includes(item.path) && item.path !== "/home"
                            ? location.pathname.startsWith(item.path)
                            : location.pathname === item.path;

                    return (
                        <ListItem key={item.name} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path);
                                    onNavigate?.(); // <- fecha drawer no mobile
                                }}
                                selected={isActive}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* Rodapé */}
            <Box
                sx={{
                    borderTop: "1px solid #e0e0e0",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <Avatar src={""} alt={usuario?.nome} />
                <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                    {usuario?.nome}
                </Typography>
                <IconButton color="error" onClick={() => setUsuario(null)}>
                    <ExitToApp fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}

