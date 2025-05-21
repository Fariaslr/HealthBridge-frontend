import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Consultas from "./pages/Consultas";
import Plano from "./pages/Plano";
import Perfil from "./pages/Perfil";

function App() {
  return (
    <BrowserRouter>
       <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Consultas" element={<Consultas />} />
        <Route path="/Plano" element={<Plano />} />
        <Route path="/Perfil" element={<Perfil />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
