import { useAuth } from "../context/AuthContext";
import { Typography, Box } from "@mui/material";

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
                    flexGrow: 1, 
                    p: 3, 
                    width: `calc(100% - 250px)`,
                }}
            >
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
                    Olá, {usuario.nome}
                </Typography>
            </Box>
        </Box>
    );
}