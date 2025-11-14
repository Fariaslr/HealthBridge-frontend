import { Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";
import { Dashboard, FitnessCenter, LocalDining, MedicalServices, AccountCircle, Assignment } from "@mui/icons-material"; // Exemplos de ícones
import { useNavigate, useLocation } from "react-router-dom"; // Para navegação

const sidebarItems = [
    { name: "Dashboard", icon: <Dashboard />, path: "/home" },
    { name: "Plano", icon: <Assignment />, path: "/plano" },
    { name: "Avaliações", icon: <MedicalServices />, path: "/avaliacao" },
    { name: "Treinos", icon: <FitnessCenter />, path: "/treino" },
    { name: "Dietas", icon: <LocalDining />, path: "/dieta" },
    { name: "Perfil", icon: <AccountCircle />, path: "/perfil" },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box
            sx={{
                width: 233,
                flexShrink: 0,
                bgcolor: 'background.paper',
                borderRight: '1px solid #e0e0e0',
                height: '100vh',
                paddingTop: 3,
            }}
        >
            <List>
                {sidebarItems.map((item) => {
                    const isActive = location.pathname.includes(item.path) && item.path !== '/home' 
                                     ? location.pathname.startsWith(item.path) 
                                     : location.pathname === item.path;

                    return (
                        <ListItem key={item.name} disablePadding>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                selected={isActive}
                                sx={{
                                    borderLeft: isActive ? '4px solid primary.main' : 'none',
                                    fontWeight: isActive ? 'bold' : 'normal',
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 35 }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}