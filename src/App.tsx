import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import type { JSX } from "react";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import CadastroPage from "./pages/CadastroPage.tsx";
import AvaliacaoPage from "./pages/AvaliacaoPage.tsx";
import PlanoPage from "./pages/PlanoPage.tsx";
import PerfilPage from "./pages/PerfilPage.tsx";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { usuario, isAuthReady } = useAuth();

  if (!isAuthReady) {

    return <p>Carregando autenticação...</p>;
  }
  return usuario ? children : <Navigate to="/login" />;
}

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
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/avaliacao"
            element={
                <AvaliacaoPage />
            }
          />
          <Route path="/plano" element={<PlanoPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;