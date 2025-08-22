import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
} from "@mui/material";

import { useState } from "react";
import Consultas from "./Consulta";
import Plano from "./Plano";
import Treinos from "./Treinos";
import Dietas from "./Dietas";


export default function Home() {
  const tabs = ["Plano", "Consultas", "Treinos", "Dietas"];
  const { usuario, setUsuario } = useAuth();
  const [activeTab, setActiveTab] = useState("Plano");
  const navigate = useNavigate();

  const handleLogout = () => {
    setUsuario(null);
    localStorage.clear();
    navigate("/login");
  };

  if (!usuario) {
    return <p>Carregando ou usuário não logado...</p>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h5" fontWeight="bold">
          Olá, {usuario.nome} {usuario.sobrenome}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Meta: {usuario.plano?.objetivo || "Não definido"}
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
          {activeTab === "Plano" && <Plano />}
          {activeTab === "Consultas" && <Consultas />}
          {activeTab === "Treinos" && <Treinos />}
          {activeTab === "Dietas" && <Dietas />}
        </Box>
      </Box>
    </Container>
  );
}
