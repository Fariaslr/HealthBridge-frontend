import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Consultas from "./pages/ConsultaPage.tsx";
import Plano from "./pages/PlanoPage.tsx";
import Perfil from "./pages/Perfil";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout"; // importe o Layout que você criou
import type { JSX } from "react";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter basename="/macros-frontend">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas com Header e Layout */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {/* Aqui vão as rotas que estarão dentro do Layout */}
          <Route path="/home" element={<Home />} />
          <Route path="/consultas" element={<Consultas />} />
          <Route path="/plano" element={<Plano />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* Rota coringa */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
