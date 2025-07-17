import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  listarConsultas,
  buscarConsultasPorPacienteId,
  buscarConsultasPorProfissionalSaudeId,
  criarConsulta,
  atualizarConsulta,
  type ConsultaRecordDto,
} from "../services/consultaService";
import styles from "./ConsultaPage.module.css";
import type { Consulta } from "../models/Consulta";
import ConsultaForm, { type ConsultaFormData } from "../components/ConsultaForm";
import ConsultaDetail from "../components/ConsultaDetail";


export default function ConsultaPage() {
  const { usuario, isAuthenticated, planoUsuario, isAuthReady, isPlanoLoading, planoInexistente } = useAuth();

  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [currentConsultaData, setCurrentConsultaData] = useState<ConsultaFormData | undefined>(undefined);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiErrorSubmit, setApiErrorSubmit] = useState<string | null>(null);

  const carregarConsultas = useCallback(async () => {
    if (!usuario?.id || !isAuthReady) {
      setLoading(false);
      setError("Usuário não autenticado ou dados de autenticação não carregados.");
      return;
    }

    if (usuario.tipoUsuario === "Paciente" && !isPlanoLoading && planoUsuario === null && !planoInexistente) {
        setLoading(false);
        setError("Aguardando carregamento do plano...");
        return;
    }
    if (usuario.tipoUsuario === "Paciente" && planoInexistente) {
        setLoading(false);
        setError("Você não possui um plano associado. Por favor, crie um plano para ver suas consultas.");
        return;
    }
    
    setLoading(true);
    setError(null);
    try {
      let fetchedConsultas: Consulta[] = [];
      if (usuario.tipoUsuario === "Paciente") {
        fetchedConsultas = await buscarConsultasPorPacienteId(usuario.id);
      } else if (usuario.tipoUsuario === "Nutricionista" || usuario.tipoUsuario === "EducadorFisico") {
        fetchedConsultas = await buscarConsultasPorProfissionalSaudeId(usuario.id);
      } else {
        fetchedConsultas = await listarConsultas();
      }
      setConsultas(fetchedConsultas);
    } catch (err: any) {
      console.error("Erro ao carregar consultas:", err);
      setError(err.message || "Não foi possível carregar as consultas.");
    } finally {
      setLoading(false);
    }
  }, [usuario, isAuthReady, isPlanoLoading, planoUsuario, planoInexistente]);

  useEffect(() => {
    if (isAuthenticated && isAuthReady) {
        if (usuario?.tipoUsuario === "Paciente") {
            if (!isPlanoLoading && (planoUsuario !== null || planoInexistente)) {
                carregarConsultas();
            } else if (isPlanoLoading) {
                // Do nothing, loading state already handled
            }
        } else {
            carregarConsultas();
        }
    } else if (!isAuthenticated && isAuthReady) {
      setLoading(false);
      setError("Faça login para ver suas consultas.");
    } else if (!isAuthReady) {
      setLoading(true);
    }
  }, [isAuthenticated, isAuthReady, usuario, planoUsuario, isPlanoLoading, planoInexistente, carregarConsultas]);

  const abrirModal = (mode: 'create' | 'edit' | 'view', consulta?: Consulta) => {
    if (mode !== 'view' && usuario?.tipoUsuario === "Paciente" && !planoUsuario) {
        setApiErrorSubmit("Você precisa ter um plano associado para criar/editar consultas.");
        return;
    }

    setApiErrorSubmit(null);
    setModalMode(mode);

    if (mode === 'create') {
        const initialFormData: ConsultaFormData = {
            planoId: '',
            profissionalSaudeId: '',
            peso: '',
            altura: '',
        };

        if (usuario?.tipoUsuario === "Paciente") {
            initialFormData.planoId = planoUsuario?.id || '';
            initialFormData.profissionalSaudeId = planoUsuario?.profissionalSaude?.id || '';
        } else if (usuario?.tipoUsuario === "Nutricionista" || usuario?.tipoUsuario === "EducadorFisico") {
            initialFormData.profissionalSaudeId = usuario.id || '';
        }
        setCurrentConsultaData(initialFormData);

    } else if (consulta) {
      const mappedData: ConsultaFormData = {
        id: consulta.id,
        planoId: consulta.plano.id,
        profissionalSaudeId: consulta.profissionalSaude.id, // Assuming it's an object, if it's an ID string, this needs adjustment in models/Consulta.ts
        peso: String(consulta.peso),
        altura: String(consulta.altura),
      };
      setCurrentConsultaData(mappedData);
    } else {
      setCurrentConsultaData(undefined);
    }
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setCurrentConsultaData(undefined);
    setApiErrorSubmit(null);
  };

  const handleEditModeRequest = (data: ConsultaFormData) => {
    setModalMode('edit');
    setCurrentConsultaData(data);
  };

  const handleFormSubmit = async (formData: ConsultaFormData) => {
    if (!usuario) {
      const authError = "Usuário não autenticado. Por favor, faça login.";
      setApiErrorSubmit(authError);
      throw new Error(authError);
    }

    let finalPlanoId: string;
    let finalProfissionalSaudeId: string;

    if (usuario.tipoUsuario === "Paciente") {
        finalPlanoId = planoUsuario?.id || '';
        if (!finalPlanoId) {
            const errorMessage = "ID do Plano não encontrado para o seu perfil de paciente. Por favor, associe um plano ou contate o suporte.";
            setApiErrorSubmit(errorMessage);
            throw new Error(errorMessage);
        }
        finalProfissionalSaudeId = formData.profissionalSaudeId;
        if (!finalProfissionalSaudeId) {
            const errorMessage = "ID do Profissional é obrigatório.";
            setApiErrorSubmit(errorMessage);
            throw new Error(errorMessage);
        }

    } else if (usuario.tipoUsuario === "Nutricionista" || usuario.tipoUsuario === "EducadorFisico") {
        finalPlanoId = formData.planoId;
        if (!finalPlanoId) {
            const errorMessage = "ID do Paciente (Plano) é obrigatório.";
            setApiErrorSubmit(errorMessage);
            throw new Error(errorMessage);
        }
        finalProfissionalSaudeId = usuario.id || '';
        if (!finalProfissionalSaudeId) {
            const errorMessage = "Não foi possível obter o ID do seu perfil de profissional logado.";
            setApiErrorSubmit(errorMessage);
            throw new Error(errorMessage);
        }
    } else {
        finalPlanoId = formData.planoId;
        finalProfissionalSaudeId = formData.profissionalSaudeId;
        if (!finalPlanoId || !finalProfissionalSaudeId) {
            const errorMessage = "ID do Paciente (Plano) e ID do Profissional são obrigatórios.";
            setApiErrorSubmit(errorMessage);
            throw new Error(errorMessage);
        }
    }

    setIsSubmitting(true);
    setApiErrorSubmit(null);

    try {
      const consultaDto: ConsultaRecordDto = {
        planoId: finalPlanoId,
        profissionalSaudeId: finalProfissionalSaudeId,
        peso: parseFloat(formData.peso),
        altura: parseFloat(formData.altura),
      };

      let result: Consulta;
      if (modalMode === 'create') {
        result = await criarConsulta(consultaDto);
        setConsultas(prev => [...prev, result]);
        alert("Consulta agendada com sucesso!");
      } else if (modalMode === 'edit' && formData.id) {
        result = await atualizarConsulta(formData.id, consultaDto);
        setConsultas(prev => prev.map(c => c.id === result.id ? result : c));
        alert("Consulta atualizada com sucesso!");
      } else {
        throw new Error("Modo de operação do modal inválido ou ID ausente para edição.");
      }

      fecharModal();
    } catch (err: any) {
      console.error("Erro na operação da consulta:", err);
      const errorMessage = apiErrorSubmit || err.message || "Erro desconhecido na operação da consulta.";
      setApiErrorSubmit(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalContent = () => {
    if (!currentConsultaData) {
      if (!isAuthReady) {
        return (<p>Inicializando autenticação...</p>);
      }
      return (<p>Carregando dados do modal ou erro inesperado.</p>);
    }

    if (modalMode === 'view') {
      const fullConsulta = consultas.find(c => c.id === currentConsultaData.id);
      return fullConsulta ? (
        <>
          <ConsultaDetail consulta={fullConsulta} />
          <div className={styles.modalActions}>
            {(usuario?.tipoUsuario === "Nutricionista" || usuario?.tipoUsuario === "EducadorFisico") && (
              <button
                onClick={() => handleEditModeRequest(currentConsultaData)}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                Editar
              </button>
            )}
            <button onClick={fecharModal} className={`${styles.button} ${styles.buttonSecondary}`}>Fechar</button>
          </div>
        </>
      ) : (<p>Detalhes da consulta não encontrados.</p>);
    } else {
      return (
        <ConsultaForm
          initialData={currentConsultaData}
          mode={modalMode}
          isLoading={isSubmitting}
          apiError={apiErrorSubmit}
          onCancel={fecharModal}
          onFormSubmit={handleFormSubmit}
          onEditRequest={handleEditModeRequest}
          userType={usuario?.tipoUsuario}
          userId={usuario?.id}
        />
      );
    }
  };

  // Melhoria na exibição de loading inicial da página
  if (!isAuthReady) {
      return (<p className={styles.loadingMessage}>Verificando autenticação...</p>);
  }

  // --- Lógica de Renderização Principal da Página ---
  // Condição para não exibir a lista de consultas se o plano não está resolvido (para Paciente)
  if (usuario?.tipoUsuario === "Paciente" && isPlanoLoading) {
      return <p className={styles.loadingMessage}>Carregando dados do plano do paciente...</p>;
  }
  if (usuario?.tipoUsuario === "Paciente" && planoInexistente) {
      // Se o plano não existe, exibe uma mensagem e não a lista de consultas
      return (
          <div className={styles.container}>
              <p className={styles.errorMessage}>Você não possui um plano associado. Por favor, vá para a aba "Plano" para criar seu plano para ver suas consultas.</p>
              {/* Você pode adicionar um botão aqui se quiser direcionar o usuário */}
              {/* <button onClick={() => navigate('/plano')}>Ir para Plano</button> */}
          </div>
      );
  }


  if (loading) {
    return (<p className={styles.loadingMessage}>Carregando consultas...</p>);
  }

  if (error) {
    // Se o erro é específico de "plano não encontrado", ele já foi tratado acima
    // Este 'error' aqui seria para erros na busca de consultas em si
    return (<p className={styles.errorMessage}>{error}</p>);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Minhas Consultas</h1>
      {(usuario?.tipoUsuario === "Paciente" || usuario?.tipoUsuario === "Nutricionista" || usuario?.tipoUsuario === "EducadorFisico") && (
        <button onClick={() => abrirModal('create')} className={styles.createButton}>
          Agendar Nova Consulta
        </button>
      )}

      {consultas.length === 0 ? (
        <p className={styles.noConsultasMessage}>Nenhuma consulta encontrada.</p>
      ) : (
        <div className={styles.consultasList}>
          {consultas.map(consulta => (
            <div key={consulta.id} className={styles.consultaCard}>
              {/* --- AJUSTES DE RENDERIZAÇÃO DEFENSIVA --- */}
              {/* dataHora */}
              <p><strong>Data e Hora:</strong> {consulta.dataAtualizacao ? new Date(consulta.dataAtualizacao).toLocaleString('pt-BR') : 'Data não disponível'}</p>
              
              {/* Paciente */}
              <p>
                <strong>Paciente:</strong>
                {consulta.plano?.paciente?.nome} {consulta.plano?.paciente?.sobrenome}
              </p>
              
              {/* Profissional */}
              <p>
                <strong>Profissional:</strong>
                {/* Verifica se profissionalSaude é um objeto e não nulo antes de acessar 'nome' */}
                {typeof consulta.profissionalSaude === 'object' && consulta.profissionalSaude !== null ?
                  `${consulta.profissionalSaude.nome} ${consulta.profissionalSaude.sobrenome} (${consulta.profissionalSaude.tipoUsuario})` :
                  // Se não for objeto (i.e., é um ID string, como no JSON anterior) ou é null/undefined
                  `ID: ${consulta.profissionalSaude || 'Não disponível'}`
                }
              </p>
              {/* --- FIM DOS AJUSTES DE RENDERIZAÇÃO DEFENSIVA --- */}

              <p><strong>Peso:</strong> {consulta.peso} kg</p>
              <p><strong>Altura:</strong> {consulta.altura} cm</p>

              <p className={styles.auditDates}>
                Criado em: {new Date(consulta.dataCriacao).toLocaleDateString('pt-BR')} |
                Última Atualização: {new Date(consulta.dataAtualizacao).toLocaleDateString('pt-BR')}
              </p>
              <div className={styles.cardActions}>
                <button
                  onClick={() => abrirModal('edit', consulta)} // Abre em modo editar
                  className={`${styles.button} ${styles.buttonSecondary}`}
                >
                  Ver Detalhes
                </button>
                {(usuario?.tipoUsuario === "Nutricionista" || usuario?.tipoUsuario === "EducadorFisico") && (
                  <button
                    onClick={() => abrirModal('edit', consulta)}
                    className={`${styles.button} ${styles.buttonPrimary}`}
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}