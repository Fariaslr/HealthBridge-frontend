import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Cadastro from "./pages/Cadastro.tsx";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import type { JSX } from "react";
import Plano from "./pages/Plano.tsx";
import Consulta from "./pages/Consulta.tsx";

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
          <Route path="/consultas" element={<Consulta />} />
          <Route path="/planoPage" element={<Plano />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;