import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { criarPlano, atualizarPlano, type PlanoRecordDto } from "../services/planoService";
import { Modal } from "../components/ModalPlano";
import type { Plano } from "../models/Plano";
import styles from "./PlanoPage.module.css";

export default function PlanoPage() {
  const { usuario, planoUsuario, carregarPlanoUsuario, isPlanoLoading, planoInexistente, isAuthReady } = useAuth();

  const [modalAberto, setModalAberto] = useState(false);
  const [novoPlano, setNovoPlano] = useState({
    objetivo: "",
    nivelAtividadeFisica: "",
  });
  const [criando, setCriando] = useState(false);
  const [atualizandoCampo, setAtualizandoCampo] = useState<string | null>(null); // Indica qual campo está sendo salvo

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const handleChangeSelectCriacao = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNovoPlano((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeSelectEdicao = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!planoUsuario || !planoUsuario.id) {
      console.error("Erro: Plano não carregado ou sem ID para atualização.");
      alert("Não foi possível atualizar o plano: dados ausentes.");
      return;
    }

    const { name, value } = e.target;
    const fieldName = name as keyof Plano;

    if (planoUsuario[fieldName] === value) {
      return;
    }

    setAtualizandoCampo(fieldName);

    try {
      const dtoParaAtualizar: Partial<PlanoRecordDto> = {
        [fieldName]: value,
      };

      const planoAtualizado = await atualizarPlano(planoUsuario.id, dtoParaAtualizar);
      console.log("Plano atualizado com sucesso:", planoAtualizado);

      await carregarPlanoUsuario();
      alert(`Plano atualizado: ${name.replace(/([A-Z])/g, " $1").toLowerCase()} para ${value}.`);
    } catch (error: any) {
      console.error(`Erro ao atualizar ${name}:`, error);
      alert(
        `Erro ao atualizar ${name}: ` +
          (error.response?.data?.message || error.message || "Erro desconhecido.")
      );
    } finally {
      setAtualizandoCampo(null);
    }
  };

  const handleCriarPlano = async () => {
    if (!usuario || !usuario.id) return alert("Usuário não autenticado");

    if (!novoPlano.objetivo || !novoPlano.nivelAtividadeFisica) {
      return alert("Preencha todos os campos");
    }

    setCriando(true);

    try {
      const planoCriado = await criarPlano({
        pacienteId: usuario.id,
        objetivo: novoPlano.objetivo,
        nivelAtividadeFisica: novoPlano.nivelAtividadeFisica,
        profissionalSaudeId: "cb660dd7-11b2-4283-a127-e939bd01f74e",
      });

      console.log("Plano criado:", planoCriado);

      await carregarPlanoUsuario();
      alert("Plano criado com sucesso!");
      setNovoPlano({ objetivo: "", nivelAtividadeFisica: "" });
      fecharModal();
    } catch (error: any) {
      console.error("Erro ao criar plano:", error);
      alert(error?.message || "Erro ao criar plano");
    } finally {
      setCriando(false);
    }
  };

  if (!isAuthReady) return <p>Verificando autenticação e carregando dados...</p>;
  if (!usuario) return <p>Por favor, faça login para ver seu plano.</p>;
  if (isPlanoLoading) return <p>Carregando plano...</p>;

  if (planoUsuario === null && !planoInexistente) {
    return (
      <div style={{ padding: "2rem", fontFamily: "Arial" }}>
        <p>Nenhum plano encontrado para o usuário.</p>
        <button onClick={abrirModal}>Criar Novo Plano</button>
      </div>
    );
  }

  let mainContent;
  if (planoInexistente) {
    mainContent = (
      <>
        <p>Nenhum plano encontrado para o usuário.</p>
        <button onClick={abrirModal}>Criar Novo Plano</button>
      </>
    );
  } else {
    const plano = planoUsuario!;

    mainContent = (
      <>
        <h2>Plano de {plano.paciente?.nome || "Paciente"}</h2>

        <div className={styles.formGroup}>
          <label htmlFor="objetivo">
            <strong>Objetivo:</strong>
          </label>
          <select
            id="objetivo"
            name="objetivo"
            value={plano.objetivo}
            onChange={handleChangeSelectEdicao}
            disabled={atualizandoCampo === "objetivo"}
            className={styles.selectInput}
            style={{ marginLeft: "10px" }}
          >
            <option value="EMAGRECIMENTO">Emagrecimento</option>
            <option value="MANUTENCAO">Manutenção do peso</option>
            <option value="HIPERTROFIA">Hipertrofia</option>
          </select>
          {atualizandoCampo === "objetivo" && (
            <span className={styles.loadingSpinner} style={{ marginLeft: "1rem" }}>
              🔄 Salvando...
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="nivelAtividadeFisica">
            <strong>Nível de Atividade Física:</strong>
          </label>
          <select
            id="nivelAtividadeFisica"
            name="nivelAtividadeFisica"
            value={plano.nivelAtividadeFisica}
            onChange={handleChangeSelectEdicao}
            disabled={atualizandoCampo === "nivelAtividadeFisica"}
            className={styles.selectInput}
            style={{ marginLeft: "10px" }}
          >
            <option value="SEDENTARIO">Sedentário</option>
            <option value="LEVEMENTE_ATIVO">Levemente ativo</option>
            <option value="MODERADAMENTE_ATIVO">Moderadamente ativo</option>
            <option value="ALTAMENTE_ATIVO">Altamente ativo</option>
            <option value="EXTREMAMENTE_ATIVO">Extremamente ativo</option>
          </select>
          {atualizandoCampo === "nivelAtividadeFisica" && (
            <span className={styles.loadingSpinner} style={{ marginLeft: "1rem" }}>
              🔄 Salvando...
            </span>
          )}
        </div>

        <p>
          <strong>Profissional:</strong> {plano.profissionalSaude?.nome || "N/A"}
        </p>
        <p>
          <strong>Criado em:</strong>{" "}
          {new Date(plano.dataCriacao).toLocaleDateString()}{" "}
          {new Date(plano.dataCriacao).toLocaleTimeString()}
        </p>
        <p>
          <strong>Última Atualização:</strong>{" "}
          {new Date(plano.dataAtualizacao).toLocaleDateString()}{" "}
          {new Date(plano.dataAtualizacao).toLocaleTimeString()}
        </p>
      </>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      {mainContent}

      <Modal isOpen={modalAberto} onClose={fecharModal}>
        <h3>Criar novo plano</h3>
        <label>
          Objetivo:
          <select
            name="objetivo"
            value={novoPlano.objetivo}
            onChange={handleChangeSelectCriacao}
            style={{ marginLeft: 10 }}
          >
            <option value="">Selecione</option>
            <option value="EMAGRECIMENTO">Emagrecimento</option>
            <option value="MANUTENCAO">Manutenção do peso</option>
            <option value="HIPERTROFIA">Hipertrofia</option>
          </select>
        </label>
        <br />
        <label>
          Nível de Atividade Física:
          <select
            name="nivelAtividadeFisica"
            value={novoPlano.nivelAtividadeFisica}
            onChange={handleChangeSelectCriacao}
            style={{ marginLeft: 10 }}
          >
            <option value="">Selecione</option>
            <option value="SEDENTARIO">Sedentário</option>
            <option value="LEVEMENTE_ATIVO">Levemente ativo</option>
            <option value="MODERADAMENTE_ATIVO">Moderadamente ativo</option>
            <option value="ALTAMENTE_ATIVO">Altamente ativo</option>
            <option value="EXTREMAMENTE_ATIVO">Extremamente ativo</option>
          </select>
        </label>
        <br />
        <button onClick={handleCriarPlano} disabled={criando} style={{ marginTop: "1rem" }}>
          {criando ? "Criando..." : "Criar Plano"}
        </button>
      </Modal>
    </div>
  );
}
