import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { usuario, setUsuario } = useAuth();
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
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Bem-vindo, {usuario.nome}!</h1>

      <section style={{ marginTop: "2rem" }}>
        <button onClick={() => navigate("/Perfil")} style={btnStyle}>Editar Perfil</button>
        <button onClick={() => navigate("/Plano")} style={btnStyle}>Ver Planos</button>
        <button onClick={() => navigate("/Consultas")} style={btnStyle}>Ver Consultas</button>
      </section>

      <button onClick={handleLogout} style={{ ...btnStyle, backgroundColor: "#c0392b", marginTop: "2rem" }}>
        Sair
      </button>
    </div>
  );
}

const btnStyle = {
  padding: "0.5rem 1rem",
  marginRight: "1rem",
  marginTop: "0.5rem",
  border: "none",
  backgroundColor: "#3498db",
  color: "white",
  borderRadius: "5px",
  cursor: "pointer"
};
