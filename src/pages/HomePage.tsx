import { useAuth } from "../context/AuthContext";
import { Typography, Box } from "@mui/material";
import { Outlet, } from "react-router-dom";

export default function HomePage() {
    const { usuario } = useAuth();

    if (!usuario) {
        return <p>Carregando ou usuário não logado...</p>;
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', paddingTop: '64px' }}>

            <Box
                component="main"
                sx={{
                    flexGrow: 1, // Permite que o conteúdo ocupe o espaço restante
                    p: 3, // Padding interno
                    width: `calc(100% - 250px)`, // Ajuste dinâmico (250px é a largura da sidebar)
                }}
            >
                {/* Título de Boas-vindas (Mantido no topo do conteúdo) */}
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
                    Olá, {usuario.nome}
                </Typography>
            </Box>
        </Box>
    );
}