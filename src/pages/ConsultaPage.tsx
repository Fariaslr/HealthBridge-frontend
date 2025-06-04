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

// Importe os tipos específicos de Pessoa para type narrowing
import type { Pessoa } from "../models/Pessoa"; // Base Pessoa
import type { Paciente } from "../models/Paciente"; // Paciente estende Pessoa
import type { ProfissionalSaude } from "../models/ProfissionalSaude"; // ProfissionalSaude estende Pessoa

import ModalBase from "../components/ModalBase";
import ConsultaForm, { type ConsultaFormData } from "../components/ConsultaForm";
import ConsultaDetail from "../components/ConsultaDetail";


export default function ConsultaPage() {
  // Obtenha 'usuario', 'isAuthenticated', 'planoUsuario' e 'isAuthReady' do contexto
  // O tipo de 'usuario' aqui é uma união de tipos (Pessoa | Paciente | ProfissionalSaude | null)
  const { usuario, isAuthenticated, planoUsuario, isAuthReady } = useAuth();

  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true); // Controla o loading da lista de consultas
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [currentConsultaData, setCurrentConsultaData] = useState<ConsultaFormData | undefined>(undefined);

  const [isSubmitting, setIsSubmitting] = useState(false); // Controla o loading do formulário
  const [apiErrorSubmit, setApiErrorSubmit] = useState<string | null>(null);

  // Função para carregar as consultas (memoizada com useCallback)
  const carregarConsultas = useCallback(async () => {
    // Apenas carrega se o usuário estiver autenticado e o AuthContext estiver pronto
    if (!usuario?.id || !isAuthReady) {
      setLoading(false);
      setError("Usuário não autenticado ou dados de autenticação não carregados.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let fetchedConsultas: Consulta[] = [];
      // Use type narrowing para acessar propriedades específicas de Paciente/ProfissionalSaude
      if (usuario.tipoUsuario === "Paciente") {
        fetchedConsultas = await buscarConsultasPorPacienteId(usuario.id);
      } else if (usuario.tipoUsuario === "Nutricionista" || usuario.tipoUsuario === "EducadorFisico") {
        fetchedConsultas = await buscarConsultasPorProfissionalSaudeId(usuario.id);
      } else {
        // Caso para outros tipos de usuário ou admin que podem listar todas as consultas
        fetchedConsultas = await listarConsultas();
      }
      setConsultas(fetchedConsultas);
    } catch (err: any) {
      console.error("Erro ao carregar consultas:", err);
      setError(err.message || "Não foi possível carregar as consultas.");
    } finally {
      setLoading(false);
    }
  }, [usuario, isAuthReady]); // Depende de usuario e isAuthReady

  useEffect(() => {
    if (isAuthenticated && isAuthReady) { // Garante que AuthContext está pronto
      carregarConsultas();
    } else if (!isAuthenticated && isAuthReady) { // Se não autenticado e pronto, para de carregar
      setLoading(false);
      setError("Faça login para ver suas consultas.");
    } else if (!isAuthReady) { // Se não está pronto, mostra loading inicial
      setLoading(true); // Mantém o estado de loading enquanto AuthContext inicializa
    }
  }, [isAuthenticated, isAuthReady, carregarConsultas]);


  const abrirModal = (mode: 'create' | 'edit' | 'view', consulta?: Consulta) => {
    setApiErrorSubmit(null);
    setModalMode(mode);

    if (mode === 'create') {
        const initialFormData: ConsultaFormData = {
            planoId: '', // Sempre inicializa vazio no form
            profissionalSaudeId: '',
            peso: '',
            altura: '',
        };

        if (usuario?.tipoUsuario === "Paciente") {
            // Se o usuário é um paciente, seu planoId VEM DO PLANOUSUARIO DO CONTEXTO
            initialFormData.planoId = planoUsuario?.id || '';
            // Pré-preenche o ID do profissional com o ID do profissional de saúde responsável pelo plano do paciente (do plano do contexto)
            initialFormData.profissionalSaudeId = planoUsuario?.profissionalSaude?.id || '';
        } else if (usuario?.tipoUsuario === "Nutricionista" || usuario?.tipoUsuario === "EducadorFisico") {
            // Se o usuário é um profissional, pré-preenche seu próprio ID como profissional
            initialFormData.profissionalSaudeId = usuario.id || '';
        }
        setCurrentConsultaData(initialFormData);

    } else if (consulta) {
      // Mapeia a Consulta (do backend) para ConsultaFormData (para o formulário/detalhes)
      const mappedData: ConsultaFormData = {
        id: consulta.id,
        planoId: consulta.plano.id, // ID do plano da consulta existente
        profissionalSaudeId: consulta.profissionalSaude.id, // ID do profissional da consulta existente
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
        // Paciente: planoId vem do planoUsuario do contexto, profissionalSaudeId vem do formulário
        finalPlanoId = planoUsuario?.id || '';
        if (!finalPlanoId) {
            const errorMessage = "ID do Plano não encontrado para o seu perfil de paciente. Por favor, associe um plano ou contate o suporte.";
            setApiErrorSubmit(errorMessage);
            throw new Error(errorMessage);
        }
        finalProfissionalSaudeId = formData.profissionalSaudeId; // Paciente preenche ID do profissional
        if (!finalProfissionalSaudeId) {
            const errorMessage = "ID do Profissional é obrigatório.";
            setApiErrorSubmit(errorMessage);
            throw new Error(errorMessage);
        }

    } else if (usuario.tipoUsuario === "Nutricionista" || usuario.tipoUsuario === "EducadorFisico") {
        // Profissional: planoId vem do formulário (ele digita o paciente/plano)
        finalPlanoId = formData.planoId; // Profissional preenche ID do plano
        if (!finalPlanoId) {
            const errorMessage = "ID do Paciente (Plano) é obrigatório.";
            setApiErrorSubmit(errorMessage);
            throw new Error(errorMessage);
        }
        // Profissional usa seu próprio ID logado do contexto
        finalProfissionalSaudeId = usuario.id || ''; // Safeguard contra undefined
        if (!finalProfissionalSaudeId) {
            const errorMessage = "Não foi possível obter o ID do seu perfil de profissional logado.";
            setApiErrorSubmit(errorMessage);
            throw new Error(errorMessage);
        }
    } else {
        // Outros tipos de usuário ou caso inesperado, ambos IDs devem vir do formulário
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
                // No modo 'view', este botão chama handleEditModeRequest para mudar para o modo de edição
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
    } else { // 'create' ou 'edit'
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

  if (loading) {
    return (<p className={styles.loadingMessage}>Carregando consultas...</p>);
  }

  if (error) {
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
              <p><strong>Data e Hora:</strong> {consulta.dataAtualizacao ? new Date(consulta.dataAtualizacao).toLocaleString('pt-BR') : 'Data não disponível'}</p>
              {/* O erro 'Cannot read properties of undefined (reading 'nome')' indica que profissionalSaude não é um objeto */}
              {/* O backend precisa enviar o objeto completo ProfissionalSaude. Se não for, ou você exibe o ID, ou busca os detalhes */}
              <p>
                <strong>Paciente:</strong>
                {/* Verifica se consulta.plano e consulta.plano.paciente existem antes de acessar nome/sobrenome */}
                {consulta.plano?.paciente?.nome} {consulta.plano?.paciente?.sobrenome}
              </p>
              <p>
                <strong>Profissional:</strong>
                {/* Acessa o nome e sobrenome do profissionalSaude se ele for um objeto. Senão, exibe o ID (que é o que está vindo no JSON) */}
                {typeof consulta.profissionalSaude === 'object' && consulta.profissionalSaude !== null ?
                  `${consulta.profissionalSaude.nome} ${consulta.profissionalSaude.sobrenome} (${consulta.profissionalSaude.tipoUsuario})` :
                  `ID: ${consulta.profissionalSaude}` // Exibe o ID se não for um objeto
                }
              </p>
              <p><strong>Peso:</strong> {consulta.peso} kg</p>
              <p><strong>Altura:</strong> {consulta.altura} cm</p>

              {/* Removidos numeroRefeicoes, observacoes e medidas, pois você simplificou o DTO */}
              {/* Se o JSON de resposta ainda os contém, mas você não os quer exibir, não é necessário alteração */}
              {/* Se você os quer exibir, mas simplificou o DTO de ENVIO, precisa atualizar a interface Consulta para RECBÊ-LOS */}
              {/* Ex: se observacoes volta no JSON, mas foi removida do DTO de ENVIO */}
              {/* {consulta.observacoes && (<p><strong>Observações:</strong> {consulta.observacoes}</p>)} */}

              <p className={styles.auditDates}>
                Criado em: {new Date(consulta.dataCriacao).toLocaleDateString('pt-BR')} |
                Última Atualização: {new Date(consulta.dataAtualizacao).toLocaleDateString('pt-BR')}
              </p>
              <div className={styles.cardActions}>
                <button
                  onClick={() => abrirModal('edit', consulta)} // MUDADO PARA ABRIR EM MODO EDITAR
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

      <ModalBase
        isOpen={isModalOpen}
        onClose={fecharModal}
        title={
            modalMode === 'create' ? 'Agendar Nova Consulta' :
            modalMode === 'edit' ? 'Editar Consulta' :
            'Detalhes da Consulta'
        }
      >
        {getModalContent()}
      </ModalBase>
    </div>
  );
}