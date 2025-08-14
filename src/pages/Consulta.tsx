import { useAuth } from "../context/AuthContext";

export default function Consulta() {
  const { usuario } = useAuth();

  return (
    <div >
      <h2>Minhas Consultas</h2>
      {(usuario?.tipoUsuario === "Paciente" || usuario?.tipoUsuario === "Nutricionista" || usuario?.tipoUsuario === "EducadorFisico") && (
        <button onClick={() =>(console.log("Botão de agendamento clicado!"))}>
          Clique aqui
        </button>
      )}
    </div>
  );
}
