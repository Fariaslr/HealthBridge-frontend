import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  Box,
} from "@mui/material";

import { useState } from "react";
import Plano from "./PlanoPage";
import Dietas from "./DietaPage";
import Dashboard from "./DashboardPage";
import AvaliacaoPage from "./AvaliacaoPage";
import PerfilPage from "./PerfilPage";
import TreinoPage from "./TreinoPage";


export default function HomePage() {
  const tabs = ["Dashboard","Plano", "Avaliações", "Treinos", "Dietas","Perfil"];
  const { usuario } = useAuth();
  const [activeTab, setActiveTab] = useState("Perfil");

  if (!usuario) {
    return <p>Carregando ou usuário não logado...</p>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h5" fontWeight="bold">
          Olá, {usuario.nome}
        </Typography>
      </Box>
      <Box>
        <Box
          display="flex"
          gap={3}
          mb={3}
          sx={{ borderBottom: "1px solid #e5e7eb" }}
        >
          {tabs.map((tab) => (
            <Typography
              key={tab}
              onClick={() => setActiveTab(tab)}
              sx={{
                pb: 1,
                cursor: "pointer",
                borderBottom:
                  activeTab === tab
                    ? "2px solid black"
                    : "2px solid transparent",
                fontWeight: activeTab === tab ? "bold" : "normal",
                color: activeTab === tab ? "black" : "gray",
                transition: "0.2s",
                "&:hover": {
                  color: "black",
                },
              }}
            >
              {tab}
            </Typography>
          ))}
        </Box>
        <Box>
          {activeTab === "Dashboard" && <Dashboard />}
          {activeTab === "Plano" && <Plano />}
          {activeTab === "Avaliações" && <AvaliacaoPage />}
          {activeTab === "Treinos" && <TreinoPage />}
          {activeTab === "Dietas" && <Dietas />}
          {activeTab === "Perfil" && <PerfilPage />}
        </Box>
      </Box>
    </Container>
  );
}
