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
    <div>
      <h1>Bem-vindo, {usuario.nome}!</h1>

      <section >
        <button onClick={() => navigate("/Perfil")} >Editar Perfil</button>
        <button onClick={() => navigate("/PlanoPage")} >Ver Planos</button>
        <button onClick={() => navigate("/Consultas")} >Ver Consultas</button>
      </section>

      <button onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}

