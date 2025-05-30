// src/pages/ConsultaPage.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  listarConsultas,
  buscarConsultasPorPacienteId,
  buscarConsultasPorProfissionalSaudeId,
  criarConsulta,
  type ConsultaRecordDto, // Certifique-se que ConsultaRecordDto é o DTO correto para a API
} from "../services/consultaService";
import styles from "./ConsultaPage.module.css";
import type { Consulta } from "../models/Consulta";

// Importe o ModalCriarConsulta que você forneceu no início
import ModalConsulta from "../components/ModalConsulta"; // Ajuste o caminho se necessário

// Definição do DTO que o formulário do ModalCriarConsulta irá preencher
// Corresponde ao NovaConsultaForm que você tinha no ModalCriarConsulta
interface NovaConsultaFormData {
  planoId: string;
  profissionalSaudeId: string;
  dataConsulta: string; // Será formatada de datetime-local
  peso: string;
  altura: string;
  numeroRefeicoes: string;
  torax?: string;
  abdomen?: string;
  cintura?: string;
  quadril?: string;
  bracoEsquerdo?: string;
  bracoDireito?: string;
  antibracoEsquerdo?: string;
  antibracoDireito?: string;
  coxaEsquerda?: string;
  coxaDireita?: string;
  panturrilhaEsquerda?: string;
  panturrilhaDireita?: string;
  pescoco?: string;
}

export default function ConsultaPage() {
  const { usuario, isAuthenticated } = useAuth();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalCriarConsultaOpen, setIsModalCriarConsultaOpen] = useState(false);
  const [criandoConsulta, setCriandoConsulta] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null); // Para erros específicos do modal de criação

  // Efeito para carregar as consultas existentes
  useEffect(() => {
    async function carregarConsultas() {
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
          // Para outros tipos de usuário, pode-se listar todas as consultas (se tiver permissão)
          fetchedConsultas = await listarConsultas();
        }
        setConsultas(fetchedConsultas);
      } catch (err: any) {
        console.error("Erro ao carregar consultas:", err);
        setError(err.message || "Não foi possível carregar as consultas.");
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      carregarConsultas();
    } else {
      setLoading(false);
      setError("Faça login para ver suas consultas.");
    }
  }, [usuario, isAuthenticated]);

  const abrirModalCriarConsulta = () => {
    setIsModalCriarConsultaOpen(true);
    setModalError(null); // Limpar erros do modal ao abrir
  };

  const fecharModalCriarConsulta = () => {
    setIsModalCriarConsultaOpen(false);
  };

  const handleCriarNovaConsulta = async (formData: NovaConsultaFormData) => {
    if (!usuario) {
      setModalError("Usuário não autenticado. Por favor, faça login.");
      return;
    }

    setCriandoConsulta(true);
    setModalError(null); // Limpa erros antes de tentar criar

    try {
      // O backend provavelmente espera um ConsultaRecordDto, vamos mapear o formData para ele
      // Assumindo que ConsultaRecordDto tem campos semelhantes e pode aceitar os dados do formulário
      // É crucial que os IDs sejam UUIDs válidos e que 'dataConsulta' seja um formato aceito pelo backend
      // O 'dataConsulta' do ModalCriarConsulta já vem em YYYY-MM-DDTHH:mm, que pode ser parseado para ISO string

      const consultaDto: ConsultaRecordDto = {
        dataHora: new Date(formData.dataConsulta).toISOString(), // Converte para ISO string
        observacoes: `Peso: ${formData.peso}kg, Altura: ${formData.altura}cm, Refeições: ${formData.numeroRefeicoes}. Medidas: Tórax: ${formData.torax || '-'}cm, Abdômen: ${formData.abdomen || '-'}cm, Cintura: ${formData.cintura || '-'}cm, Quadril: ${formData.quadril || '-'}cm, Braço E: ${formData.bracoEsquerdo || '-'}cm, Braço D: ${formData.bracoDireito || '-'}cm, Antebraço E: ${formData.antibracoEsquerdo || '-'}cm, Antebraço D: ${formData.antibracoDireito || '-'}cm, Coxa E: ${formData.coxaEsquerda || '-'}cm, Coxa D: ${formData.coxaDireita || '-'}cm, Panturrilha E: ${formData.panturrilhaEsquerda || '-'}cm, Panturrilha D: ${formData.panturrilhaDireita || '-'}cm, Pescoço: ${formData.pescoco || '-'}cm.`,
        pacienteId: usuario.tipoUsuario === "Paciente" ? usuario.id : formData.planoId, // Precisa verificar como o planoId se relaciona com pacienteId
        profissionalSaudeId: (usuario.tipoUsuario === "Nutricionista" || usuario.tipoUsuario === "EducadorFisico") ? usuario.id : formData.profissionalSaudeId, // Precisa verificar o ID do profissional
        // O `planoId` do formulário pode não ser o `pacienteId` direto,
        // dependendo da sua lógica de negócio. Adapte esta linha!
        // No seu DTO original (ConsultaRecordDto), não há 'planoId', 'peso', 'altura', etc.
        // É essencial que o `ConsultaRecordDto` do backend aceite esses dados,
        // ou que `observacoes` os contenha como uma string formatada.
        // A adaptação acima coloca as medidas nas observações para fins de exemplo.
        // Se o backend tiver campos específicos para medidas, você precisaria adaptar o DTO.
      };

      const consultaCriada = await criarConsulta(consultaDto);
      setConsultas(prev => [...prev, consultaCriada]); // Adiciona a nova consulta à lista
      fecharModalCriarConsulta(); // Fecha o modal após o sucesso
      alert("Consulta agendada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao agendar consulta:", err);
      setModalError(err.message || "Erro desconhecido ao agendar consulta.");
      // O modal pode exibir este erro internamente
    } finally {
      setCriandoConsulta(false);
    }
  };

  if (loading) {
    return <p className={styles.loadingMessage}>Carregando consultas...</p>;
  }

  if (error) {
    return <p className={styles.errorMessage}>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Minhas Consultas</h1>
      {(usuario?.tipoUsuario === "Paciente" || usuario?.tipoUsuario === "Nutricionista" || usuario?.tipoUsuario === "EducadorFisico") && (
        <button onClick={abrirModalCriarConsulta} className={styles.createButton}>
          Agendar Nova Consulta
        </button>
      )}

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
            </div>
          ))}
        </div>
      )}

      {/* Modal de Agendamento/Criação */}
      <ModalConsulta
        isOpen={isModalCriarConsultaOpen}
        onClose={fecharModalCriarConsulta}
        onSubmit={handleCriarNovaConsulta}
        isLoading={criandoConsulta}
        // Pré-preenchimento de IDs baseado no usuário logado
        planoIdDefault={usuario?.tipoUsuario === "Paciente" ? usuario.id : ''}
        profissionalSaudeIdDefault={
          (usuario?.tipoUsuario === "Nutricionista" || usuario?.tipoUsuario === "EducadorFisico")
            ? usuario.id
            : ''
        }
      />
    </div>
  );
}