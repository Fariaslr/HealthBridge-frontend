// src/components/Layout.tsx (CORRIGIDO)
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material"; // 🚨 Importe Box

export default function Layout() {
  return (
    // 🚀 CORREÇÃO CRÍTICA: Usar Box com display: 'flex' para colocar lado a lado
    <Box sx={{ display: 'flex', minHeight: '100vh' }}> 
      
      {/* 1. Sidebar (Componente fixo da coluna esquerda) */}
      <Sidebar />
      
      {/* 2. Conteúdo Principal (Coluna da direita que se ajusta) */}
      <Box 
        component="main" // Semântica: Indica que é o conteúdo principal
        sx={{ 
          flexGrow: 1, // Permite que esta Box ocupe todo o espaço restante
          padding: 3,  // Adiciona um padding interno para o conteúdo
        }}
      >
        {/* O Outlet renderiza a página filha (Plano, Avaliacoes, etc.) */}
        <Outlet />
      </Box>

    </Box>
  );
}