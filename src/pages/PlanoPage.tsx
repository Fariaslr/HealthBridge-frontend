import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  criarPlano,
  atualizarPlano,
  deletarPlano,
  type PlanoRecordDto,
} from "../services/planoService";
import { ModalPlano } from "../components/ModalPlano"; // Importa o modal multi-propósito
import type { Plano } from "../models/Plano";
import styles from "./PlanoPage.module.css";

export default function PlanoPage() {
  const { usuario, isAuthenticated, planoUsuario, isPlanoLoading, planoInexistente, isAuthReady } = useAuth();

  const [modalAberto, setModalAberto] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [planoParaEditar, setPlanoParaEditar] = useState<Plano | null>(null);

  const [criando, setCriando] = useState(false);
  const [excluindoPlano, setExcluindoPlano] = useState(false);
  const [apiErrorModal, setApiErrorModal] = useState<string | null>(null);

  const [atualizandoPlano, setAtualizandoPlano] = useState(false);

  // --- Função para abrir o modal ---
  const abrirModal = (mode: "create" | "edit", plano?: Plano) => {
    setModalMode(mode);
    setPlanoParaEditar(plano || null); // Se for edição, passa o objeto plano
    setApiErrorModal(null); // Limpa erros anteriores do modal
    setModalAberto(true);
    // Adicione um log aqui para confirmar que abrirModal é chamado
    console.log("PlanoPage: abrirModal chamado. modalAberto será:", true, "mode:", mode);
  };
  const fecharModal = () => {
    setModalAberto(false);
    setPlanoParaEditar(null);
    setApiErrorModal(null);
    console.log("PlanoPage: fecharModal chamado. modalAberto será:", false);
  };

  const handleSavePlano = async (data: PlanoRecordDto) => {
    if (!usuario) { // Já temos um if(!usuario) na renderização principal, mas é bom para o TS aqui
        setApiErrorModal("Usuário não autenticado.");
        throw new Error("Usuário não autenticado.");
    }

    // Estreitamento de tipo para 'usuario' aqui dentro, para evitar erros de 'null'
    // TypeScript agora sabe que 'usuario' não é null neste bloco.
    const currentUser = usuario; 

    // Validação para profissional de saúde: se não é paciente e profissionalSaudeId não veio
    if (currentUser.tipoUsuario !== "Paciente" && !data.profissionalSaudeId) {
        setApiErrorModal("Por favor, selecione um profissional de saúde.");
        throw new Error("Por favor, selecione um profissional de saúde.");
    }

    setApiErrorModal(null);
    setAtualizandoPlano(true);

    try {
        let savedPlano: Plano;

        const payload: PlanoRecordDto = {
            ...data,
            pacienteId: currentUser.tipoUsuario === "Paciente" ? currentUser.id : data.pacienteId,
            profissionalSaudeId: (currentUser.tipoUsuario === "Nutricionista" || currentUser.tipoUsuario === "EducadorFisico") ? currentUser.id : data.profissionalSaudeId,
        };
        
        // Validação final para ter certeza que os IDs resultantes não são vazios
        if (!payload.pacienteId) {
            setApiErrorModal("ID do Paciente é obrigatório.");
            throw new Error("ID do Paciente é obrigatório.");
        }
        if (!payload.profissionalSaudeId) {
            setApiErrorModal("ID do Profissional é obrigatório.");
            throw new Error("ID do Profissional é obrigatório.");
        }

        if (modalMode === "create") {
            savedPlano = await criarPlano(payload);
            alert("Plano criado com sucesso!");
        } else if (modalMode === "edit" && planoParaEditar?.id) {
            savedPlano = await atualizarPlano(planoParaEditar.id, payload);
            alert("Plano atualizado com sucesso!");
        } else {
            const errorMsg = "Modo de operação inválido ou ID do plano ausente para edição.";
            setApiErrorModal(errorMsg);
            throw new Error(errorMsg);
        }

        console.log("Plano salvo (criado/atualizado):", savedPlano);
        await carregarPlanoUsuario();
        fecharModal(); // Fecha o modal após o sucesso

    } catch (error: any) {
        console.error("Erro ao salvar plano:", error);
        const errorMessage = error.response?.data?.message || error.message || "Erro desconhecido ao salvar plano.";
        setApiErrorModal(errorMessage);
        throw new Error(errorMessage); // Re-lança para o modal exibir
    } finally {
        setAtualizandoPlano(false);
    }
  };

  const handleExcluirPlano = async () => {
    if (!planoUsuario || !planoUsuario.id) {
        alert("Nenhum plano para excluir.");
        return;
    }
    if (!window.confirm("Tem certeza que deseja excluir este plano?")) {
        return;
    }

    setExcluindoPlano(true);
    try {
        await deletarPlano(planoUsuario.id);
        console.log("Plano excluído com sucesso!");
        await carregarPlanoUsuario();
        alert("Plano excluído com sucesso!");
    } catch (error: any) {
        console.error("Erro ao excluir plano:", error);
        alert("Erro ao excluir plano: " + (error.response?.data?.message || error.message || "Erro desconhecido."));
    } finally {
        setExcluindoPlano(false);
    }
  };

  // Lógica de renderização
  if (!isAuthReady) {
    return <p>Verificando autenticação e carregando dados...</p>;
  }

  if (!usuario) {
    return <p>Por favor, faça login para ver seu plano.</p>;
  }

  if (isPlanoLoading) {
    return <p>Carregando plano...</p>;
  }

  if (planoInexistente) {
    return (
      <div style={{ padding: "2rem", fontFamily: "Arial" }}>
        <p>Nenhum plano encontrado para o usuário.</p>
        <button onClick={() => abrirModal("create")}>Criar Novo Plano</button>
      </div>
    );
  }

  if (planoUsuario === null) {
      console.warn("PlanoPage: planoUsuario é null em um estado final de renderização. Mostrando opção de criar.");
      return (
          <div style={{ padding: "2rem", fontFamily: "Arial" }}>
              <p>Ocorreu um problema ao carregar seu plano ou ele não está disponível. Por favor, tente novamente.</p>
              <button onClick={() => abrirModal("create")}>Tentar Criar Plano</button>
          </div>
      );
  }

  const plano = planoUsuario;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Plano de {plano.paciente?.nome || "Paciente"}</h2>
      
      <p><strong>Objetivo:</strong> {plano.objetivo}</p>
      <p><strong>Nível de Atividade Física:</strong> {plano.nivelAtividadeFisica}</p>
      
      <p><strong>Profissional:</strong> {plano.profissionalSaude?.nome || "N/A"}</p>
      <p><strong>Criado em:</strong> {new Date(plano.dataCriacao).toLocaleDateString()} {new Date(plano.dataCriacao).toLocaleTimeString()}</p>
      <p><strong>Última Atualização:</strong> {new Date(plano.dataAtualizacao).toLocaleDateString()} {new Date(plano.dataAtualizacao).toLocaleTimeString()}</p>

      <div className={styles.actionButtonsGroup} style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-start' }}>
        <button
          onClick={() => abrirModal("edit", plano)}
          disabled={excluindoPlano || criando || atualizandoPlano}
          className={styles.editButton}
        >
          Editar Plano
        </button>

        <button
          onClick={handleExcluirPlano}
          disabled={excluindoPlano || criando || atualizandoPlano}
          className={styles.deleteButton}
        >
          {excluindoPlano ? 'Excluindo...' : 'Excluir Plano'}
        </button>
      </div>

      <ModalPlano
        isOpen={modalAberto}
        onClose={fecharModal}
        mode={modalMode}
        initialData={planoParaEditar}
        onSave={handleSavePlano}
        isLoading={criando || atualizandoPlano}
        apiError={apiErrorModal}
        userType={usuario.tipoUsuario}
        userId={usuario.id}
        planoIdFromContext={planoUsuario?.id}
      />
    </div>
  );
}