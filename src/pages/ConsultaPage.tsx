import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  listarConsultas,
  buscarConsultasPorPacienteId,
  buscarConsultasPorProfissionalSaudeId,
  criarConsulta,
  atualizarConsulta, // Certifique-se de que esta função está no seu service
  type ConsultaRecordDto,
} from "../services/consultaService"; // Assumindo que você tem um service para Consulta
import styles from "./ConsultaPage.module.css";
import type { Consulta } from "../models/Consulta"; // Importe o modelo de consulta

import ModalBase from "../components/ModalBase";
import ConsultaForm, { type ConsultaFormData } from "../components/ConsultaForm";
import ConsultaDetail from "../components/ConsultaDetail";

export default function ConsultaPage() {
  const { usuario, isAuthenticated } = useAuth();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [currentConsultaData, setCurrentConsultaData] = useState<ConsultaFormData | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiErrorSubmit, setApiErrorSubmit] = useState<string | null>(null); // Erros da API para o submit
  const carregarConsultas = useCallback(async () => {
    if (!usuario?.id) {
      setLoading(false);
      setError("Usuário não autenticado.");
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
  }, [usuario]); // Depende apenas de 'usuario'

  // Efeito para carregar consultas ao montar o componente ou mudar o usuário/autenticação
  useEffect(() => {
    if (isAuthenticated) {
      carregarConsultas();
    } else {
      setLoading(false);
      setError("Faça login para ver suas consultas.");
    }
  }, [isAuthenticated, carregarConsultas]); // Depende de isAuthenticated e da função memoizada

  // Função para abrir o modal em diferentes modos (create, edit, view)
  const abrirModal = (mode: 'create' | 'edit' | 'view', consulta?: Consulta) => {
    setApiErrorSubmit(null); // Limpa erros anteriores de submissão
    setModalMode(mode);       // Define o modo do modal

    if (mode === 'create') {
      // Preenche os defaults para a criação de uma nova consulta
      setCurrentConsultaData({
        planoId: usuario?.tipoUsuario === "Paciente" ? usuario.id : '',
        profissionalSaudeId: (usuario?.tipoUsuario === "Nutricionista" || usuario?.tipoUsuario === "EducadorFisico") ? usuario.id : '',
        dataConsulta: '', peso: '', altura: '', numeroRefeicoes: '',
        torax: '', abdomen: '', cintura: '', quadril: '', bracoEsquerdo: '', bracoDireito: '',
        antibracoEsquerdo: '', antibracoDireito: '', coxaEsquerda: '', coxaDireita: '',
        panturrilhaEsquerda: '', panturrilhaDireita: '', pescoco: '',
        observacoes: '',
      });
    } else if (consulta) {
      // Mapeia a Consulta (do backend) para ConsultaFormData (para o formulário/detalhes)
      // ATENÇÃO: É CRÍTICO que esta lógica de extração das medidas da string 'observacoes'
      // seja robusta ou que seu backend forneça campos separados.
      const mappedData: ConsultaFormData = {
        id: consulta.id,
        planoId: consulta.paciente.id, // Supondo que planoId do form é o pacienteId
        profissionalSaudeId: consulta.profissionalSaude.id,
        dataConsulta: new Date(consulta.dataHora).toISOString().slice(0, 16), // Formato para input datetime-local
        // Inicializa todos os campos de medida e observações
        peso: '', altura: '', numeroRefeicoes: '', torax: '', abdomen: '', cintura: '',
        quadril: '', bracoEsquerdo: '', bracoDireito: '', antibracoEsquerdo: '', antibracoDireito: '',
        coxaEsquerda: '', coxaDireita: '', panturrilhaEsquerda: '', panturrilhaDireita: '', pescoco: '',
        observacoes: '',
      };

      // Função auxiliar para extrair medidas de uma string (MELHORE ESTA LÓGICA!)
      const extractMeasure = (obs: string | undefined, regex: RegExp) => {
        const match = obs ? regex.exec(obs) : null;
        return match && match[1] ? match[1] : '';
      };

      // Popula os campos com base na extração
      if (consulta.observacoes) {
        mappedData.peso = extractMeasure(consulta.observacoes, /Peso: ([\d.]+)kg/);
        mappedData.altura = extractMeasure(consulta.observacoes, /Altura: ([\d.]+)cm/);
        mappedData.numeroRefeicoes = extractMeasure(consulta.observacoes, /Refeições: ([\d.]+)/);
        mappedData.torax = extractMeasure(consulta.observacoes, /Tórax: ([\d.]+)cm/);
        mappedData.abdomen = extractMeasure(consulta.observacoes, /Abdômen: ([\d.]+)cm/);
        mappedData.cintura = extractMeasure(consulta.observacoes, /Cintura: ([\d.]+)cm/);
        mappedData.quadril = extractMeasure(consulta.observacoes, /Quadril: ([\d.]+)cm/);
        mappedData.bracoEsquerdo = extractMeasure(consulta.observacoes, /Braço Esquerdo: ([\d.]+)cm/);
        mappedData.bracoDireito = extractMeasure(consulta.observacoes, /Braço Direito: ([\d.]+)cm/);
        mappedData.antibracoEsquerdo = extractMeasure(consulta.observacoes, /Antebraço Esquerdo: ([\d.]+)cm/);
        mappedData.antibracoDireito = extractMeasure(consulta.observacoes, /Antebraço Direito: ([\d.]+)cm/);
        mappedData.coxaEsquerda = extractMeasure(consulta.observacoes, /Coxa Esquerda: ([\d.]+)cm/);
        mappedData.coxaDireita = extractMeasure(consulta.observacoes, /Coxa Direita: ([\d.]+)cm/);
        mappedData.panturrilhaEsquerda = extractMeasure(consulta.observacoes, /Panturrilha Esquerda: ([\d.]+)cm/);
        mappedData.panturrilhaDireita = extractMeasure(consulta.observacoes, /Panturrilha Direita: ([\d.]+)cm/);
        mappedData.pescoco = extractMeasure(consulta.observacoes, /Pescoço: ([\d.]+)cm/);

        // Separa observações gerais do restante (se o formato da string for complexo)
        // Isso é uma simplificação. Se as observações gerais são apenas o que sobra, use isso.
        // mappedData.observacoes = consulta.observacoes.replace(/Peso:.*?cm\./, '').trim();
        // Ou, se a observação geral é um campo separado no seu modelo Consulta, use-o diretamente.
        mappedData.observacoes = consulta.observacoes; // Por simplicidade, mantém tudo em observacoes
      }

      setCurrentConsultaData(mappedData);
    } else {
      // Se não há consulta e não é modo 'create', limpa os dados
      setCurrentConsultaData(undefined);
    }
    setIsModalOpen(true); // Abre o modal
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setCurrentConsultaData(undefined); // Limpa os dados ao fechar
    setApiErrorSubmit(null); // Limpa erros da API
  };

  // Função chamada pelo ConsultaForm quando o botão "Editar" é clicado no modo "view"
  const handleEditModeRequest = (data: ConsultaFormData) => {
    setModalMode('edit'); // Mudar para o modo de edição
    setCurrentConsultaData(data); // Opcional: garantir que os dados estejam atualizados (já deveriam estar)
    // Não precisa setIsModalOpen(true) pois o modal já está aberto
  };

  const handleFormSubmit = async (formData: ConsultaFormData) => {
    if (!usuario) {
      const authError = "Usuário não autenticado. Por favor, faça login.";
      setApiErrorSubmit(authError);
      throw new Error(authError);
    }

    setIsSubmitting(true);
    setApiErrorSubmit(null);

    try {
      let finalDataHora: string;
      const parsedDate = new Date(formData.dataConsulta);

      if (isNaN(parsedDate.getTime())) {
        const errorMessage = "A data e hora da consulta são inválidas. Por favor, verifique o campo.";
        setApiErrorSubmit(errorMessage);
        throw new Error(errorMessage);
      }
      finalDataHora = parsedDate.toISOString();

      if (!formData.planoId) {
        const errorMessage = "ID do Paciente é obrigatório.";
        setApiErrorSubmit(errorMessage);
        throw new Error(errorMessage);
      }
      if (!formData.profissionalSaudeId) {
        const errorMessage = "ID do Profissional é obrigatório.";
        setApiErrorSubmit(errorMessage);
        throw new Error(errorMessage);
      }

      // Dentro de handleFormSubmit em ConsultaPage.tsx
      const consultaDto: ConsultaRecordDto = {
        dataConsulta: finalDataHora, // Use dataConsulta aqui, correspondendo ao DTO Java
        peso: parseFloat(formData.peso),
        altura: parseFloat(formData.altura),
        numeroRefeicoes: parseInt(formData.numeroRefeicoes),
        torax: formData.torax ? parseFloat(formData.torax) : null,
        abdomen: formData.abdomen ? parseFloat(formData.abdomen) : null,
        cintura: formData.cintura ? parseFloat(formData.cintura) : null,
        quadril: formData.quadril ? parseFloat(formData.quadril) : null,
        bracoEsquerdo: formData.bracoEsquerdo ? parseFloat(formData.bracoEsquerdo) : null,
        bracoDireito: formData.bracoDireito ? parseFloat(formData.bracoDireito) : null,
        antibracoEsquerdo: formData.antibracoEsquerdo ? parseFloat(formData.antibracoEsquerdo) : null,
        antibracoDireito: formData.antibracoDireito ? parseFloat(formData.antibracoDireito) : null,
        coxaEsquerda: formData.coxaEsquerda ? parseFloat(formData.coxaEsquerda) : null,
        coxaDireita: formData.coxaDireita ? parseFloat(formData.coxaDireita) : null,
        panturrilhaEsquerda: formData.panturrilhaEsquerda ? parseFloat(formData.panturrilhaEsquerda) : null,
        panturrilhaDireita: formData.panturrilhaDireita ? parseFloat(formData.panturrilhaDireita) : null,
        pescoco: formData.pescoco ? parseFloat(formData.pescoco) : null,

        observacoes: formData.observacoes || null,

        planoId: formData.planoId, // <-- CORRIGIDO: Use 'planoId' para o DTO aqui
        profissionalSaudeId: formData.profissionalSaudeId,
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
      // Se não houver dados quando o modal deveria estar aberto, pode ser um estado inválido
      return <p>Carregando dados do modal ou erro inesperado.</p>;
    }

    if (modalMode === 'view') {
      // No modo 'view', exibe os detalhes da consulta
      // Precisamos da 'Consulta' completa aqui, não apenas o 'ConsultaFormData'
      const fullConsulta = consultas.find(c => c.id === currentConsultaData.id);
      return fullConsulta ? (
        <>
          <ConsultaDetail consulta={fullConsulta} />
          {/* Ações específicas para o modo de visualização dentro do modal */}
          <div className={styles.modalActions}>
            {(usuario?.tipoUsuario === "Nutricionista" || usuario?.tipoUsuario === "EducadorFisico") && (
              <button
                onClick={() => handleEditModeRequest(currentConsultaData)} // Botão Editar no MODO VIEW
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                Editar
              </button>
            )}
            <button onClick={fecharModal} className={`${styles.button} ${styles.buttonSecondary}`}>Fechar</button>
          </div>
        </>
      ) : <p>Detalhes da consulta não encontrados.</p>;
    } else {
      return (
        <ConsultaForm
          initialData={currentConsultaData}
          mode={modalMode}
          isLoading={isSubmitting}
          apiError={apiErrorSubmit}
          onCancel={fecharModal} // Botão "Cancelar" do formulário fecha o modal
          onFormSubmit={handleFormSubmit} // Formulário chama este para submeter/atualizar
          onEditRequest={handleEditModeRequest} // Formulário chama este para mudar de view->edit
        />
      );
    }
  };

  // Exibição de mensagens de carregamento ou erro na página
  if (loading) {
    return <p className={styles.loadingMessage}>Carregando consultas...</p>;
  }

  if (error) {
    return <p className={styles.errorMessage}>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Minhas Consultas</h1>
      {/* Botão para agendar nova consulta (aparece para tipos de usuário específicos) */}
      {(usuario?.tipoUsuario === "Paciente" || usuario?.tipoUsuario === "Nutricionista" || usuario?.tipoUsuario === "EducadorFisico") && (
        <button onClick={() => abrirModal('create')} className={styles.createButton}>
          Agendar Nova Consulta
        </button>
      )}

      {/* Exibição da lista de consultas */}
      {consultas.length === 0 ? (
        <p className={styles.noConsultasMessage}>Nenhuma consulta encontrada.</p>
      ) : (
        <div className={styles.consultasList}>
          {consultas.map(consulta => (
            <div key={consulta.id} className={styles.consultaCard}>
              <p><strong>Data e Hora:</strong> {new Date(consulta.dataHora).toLocaleString('pt-BR')}</p>
              <p><strong>Paciente:</strong> {consulta.paciente.nome} {consulta.paciente.sobrenome}</p>
              <p><strong>Profissional:</strong> {consulta.profissionalSaude.nome} {consulta.profissionalSaude.sobrenome} ({consulta.profissionalSaude.tipoUsuario})</p>
              {consulta.observacoes && <p><strong>Observações:</strong> {consulta.observacoes}</p>}
              <p className={styles.auditDates}>
                Criado em: {new Date(consulta.dataCriacao).toLocaleDateString('pt-BR')} |
                Última Atualização: {new Date(consulta.dataAtualizacao).toLocaleDateString('pt-BR')}
              </p>
              <div className={styles.cardActions}>
                <button
                  onClick={() => abrirModal('view', consulta)}
                  className={`${styles.button} ${styles.buttonSecondary}`}
                >
                  Ver Detalhes
                </button>
                {/* Botão de edição visível apenas para profissionais */}
                {(usuario?.tipoUsuario === "Nutricionista" || usuario?.tipoUsuario === "EducadorFisico") && (
                  <button
                    onClick={() => abrirModal('edit', consulta)}
                    className={`${styles.button} ${styles.buttonPrimary}`}
                  >
                    Editar
                  </button>
                )}
                {/* Adicionar botão de exclusão aqui, se aplicável */}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Renderiza o ModalBase com o conteúdo dinâmico (formulário ou detalhes) */}
      <ModalBase
        isOpen={isModalOpen}
        onClose={fecharModal}
        title={ // Título dinâmico do modal
          modalMode === 'create' ? 'Agendar Nova Consulta' :
            modalMode === 'edit' ? 'Editar Consulta' :
              'Detalhes da Consulta'
        }
      >
        {getModalContent()} {/* Conteúdo renderizado pelo getModalContent */}
      </ModalBase>
    </div>
  );
}