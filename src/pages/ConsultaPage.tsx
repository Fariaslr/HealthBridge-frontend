import { useAuth } from "../context/AuthContext";

export default function ConsultaPage() {
  const { usuario } = useAuth();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Minhas Consultas</h1>
      {(usuario?.tipoUsuario === "Paciente" || usuario?.tipoUsuario === "Nutricionista" || usuario?.tipoUsuario === "EducadorFisico") && (
        <button onClick={() =>("")} className={styles.createButton}>
          Agendar Nova Consulta
        </button>
      )}
    </div>
  );
}

const styles = {

}