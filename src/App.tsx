import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import type { JSX } from "react";
import LoginPage from "./pages/LoginPage.tsx";
import CadastroPage from "./pages/CadastroPage.tsx";
import AvaliacaoPage from "./pages/AvaliacaoPage.tsx";
import PlanoPage from "./pages/PlanoPage.tsx";
import PerfilPage from "./pages/PerfilPage.tsx";
import TreinoPage from "./pages/TreinoPage.tsx";
import DietaPage from "./pages/DietaPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import AvaliacaoDetalhePage from "./pages/AvaliacaoDetalhePage.tsx";
import TreinoCriarPage from "./pages/TreinoCriarPage.tsx";
import { createTheme } from "@mui/material";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { usuario, isAuthReady } = useAuth();

  if (!isAuthReady) {

    return <p>Carregando autenticação...</p>;
  }
  return usuario ? children : <Navigate to="/login" />;
}

const theme = createTheme({
  palette: {
    mode: "dark", // ativa o modo dark em tudo

    background: {
      default: "#101010",
      paper: "#181818"
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
          borderRadius: 12
        }
      }
    }
  }
});

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />

        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/home" element={<DashboardPage />} />
          <Route path="/avaliacao" element={<AvaliacaoPage />} />
          <Route path="/avaliacao/:id" element={<AvaliacaoDetalhePage />} />
          <Route path="/treino/novo/:consultaId" element={<TreinoCriarPage />} />
          <Route path="/plano" element={<PlanoPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/treino" element={<TreinoPage />} />
          <Route path="/dieta" element={<DietaPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;