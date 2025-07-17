import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import PlanoPage from "./pages/PlanoPage.tsx";
import Perfil from "./pages/Perfil";
import { useAuth } from "./context/AuthContext"; // Importe useAuth
import Layout from "./components/Layout";
import type { JSX } from "react";
import ConsultaPage from "./pages/ConsultaPage.tsx";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { usuario, isAuthReady } = useAuth(); 

  if (!isAuthReady) {
   
    return <p>Carregando autenticação...</p>;
  }
  return usuario ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter basename="/macros-frontend">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/consultas" element={<ConsultaPage />} />
          <Route path="/planoPage" element={<PlanoPage />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;