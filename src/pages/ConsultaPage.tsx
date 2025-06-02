// src/pages/ConsultaPage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  listarConsultas,
  buscarConsultasPorPacienteId,
  buscarConsultasPorProfissionalSaudeId,
  criarConsulta,
  type ConsultaRecordDto,
} from "../services/consultaService";
import styles from "./ConsultaPage.module.css";
import type { Consulta } from "../models/Consulta";

import ModalConsulta from "../components/ModalConsulta"; 

interface NovaConsultaFormState {
  planoId: string; 
  profissionalSaudeId: string;
  dataConsulta: string; 
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
  const [formError, setFormError] = useState<string | null>(null); 

  const initialNovaConsultaState: NovaConsultaFormState = {
    planoId: "",
    profissionalSaudeId: "",
    dataConsulta: "",
    peso: "",
    altura: "",
    numeroRefeicoes: "",
    torax: "",
    abdomen: "",
    cintura: "",
    quadril: "",
    bracoEsquerdo: "",
    bracoDireito: "",
    antibracoEsquerdo: "",
    antibracoDireito: "",
    coxaEsquerda: "",
    coxaDireita: "",
    panturrilhaEsquerda: "",
    panturrilhaDireita: "",
    pescoco: "",
  };
  const [novaConsultaFormData, setNovaConsultaFormData] = useState<NovaConsultaFormState>(initialNovaConsultaState);

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
    setNovaConsultaFormData(prev => ({
      ...initialNovaConsultaState, 
      planoId: usuario?.tipoUsuario === "Paciente" ? usuario.id : "",
      profissionalSaudeId: (usuario?.tipoUsuario === "Nutricionista" || usuario?.tipoUsuario === "EducadorFisico")
        ? usuario.id
        : ""
    }));
    setFormError(null); 
    setIsModalCriarConsultaOpen(true);
  };

  const fecharModalCriarConsulta = () => {
    setIsModalCriarConsultaOpen(false);
    setNovaConsultaFormData(initialNovaConsultaState);
    setFormError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNovaConsultaFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCriarNovaConsultaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null); 

    if (!usuario) {
      setFormError("Usuário não autenticado. Por favor, faça login.");
      return;
    }
    if (!novaConsultaFormData.planoId || !novaConsultaFormData.profissionalSaudeId || !novaConsultaFormData.dataConsulta || !novaConsultaFormData.peso || !novaConsultaFormData.altura || !novaConsultaFormData.numeroRefeicoes) {
      setFormError('Campos obrigatórios (ID do Plano, ID do Profissional, Data/Hora, Peso, Altura, Nº Refeições) devem ser preenchidos.');
      return;
    }

    setCriandoConsulta(true);
    try {
      const consultaDto: ConsultaRecordDto = {
        dataHora: new Date(novaConsultaFormData.dataConsulta).toISOString(), 
        observacoes: `Peso: ${novaConsultaFormData.peso}kg, Altura: ${novaConsultaFormData.altura}cm, Refeições: ${novaConsultaFormData.numeroRefeicoes}. ` +
                     `Medidas: Tórax: ${novaConsultaFormData.torax || '-'}cm, Abdômen: ${novaConsultaFormData.abdomen || '-'}cm, Cintura: ${novaConsultaFormData.cintura || '-'}cm, Quadril: ${novaConsultaFormData.quadril || '-'}cm, ` +
                     `Braço E: ${novaConsultaFormData.bracoEsquerdo || '-'}cm, Braço D: ${novaConsultaFormData.bracoDireito || '-'}cm, Antebraço E: ${novaConsultaFormData.antibracoEsquerdo || '-'}cm, Antebraço D: ${novaConsultaFormData.antibracoDireito || '-'}cm, ` +
                     `Coxa E: ${novaConsultaFormData.coxaEsquerda || '-'}cm, Coxa D: ${novaConsultaFormData.coxaDireita || '-'}cm, Panturrilha E: ${novaConsultaFormData.panturrilhaEsquerda || '-'}cm, Panturrilha D: ${novaConsultaFormData.panturrilhaDireita || '-'}cm, ` +
                     `Pescoço: ${novaConsultaFormData.pescoco || '-'}cm.`,
        pacienteId: novaConsultaFormData.planoId,
        profissionalSaudeId: novaConsultaFormData.profissionalSaudeId,
      };

      const consultaCriada = await criarConsulta(consultaDto);
      setConsultas(prev => [...prev, consultaCriada]); 
      fecharModalCriarConsulta(); 
      alert("Consulta agendada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao agendar consulta:", err);
      setFormError(err.message || "Erro desconhecido ao agendar consulta.");
    } finally {
      setCriandoConsulta(false);
    }
  };

  const camposMedidas = [
    { label: 'Tórax (cm)', name: 'torax', value: novaConsultaFormData.torax },
    { label: 'Abdômen (cm)', name: 'abdomen', value: novaConsultaFormData.abdomen },
    { label: 'Cintura (cm)', name: 'cintura', value: novaConsultaFormData.cintura },
    { label: 'Quadril (cm)', name: 'quadril', value: novaConsultaFormData.quadril },
    { label: 'Braço Esquerdo (cm)', name: 'bracoEsquerdo', value: novaConsultaFormData.bracoEsquerdo },
    { label: 'Braço Direito (cm)', name: 'bracoDireito', value: novaConsultaFormData.bracoDireito },
    { label: 'Antebraço Esquerdo (cm)', name: 'antibracoEsquerdo', value: novaConsultaFormData.antibracoEsquerdo },
    { label: 'Antebraço Direito (cm)', name: 'antibracoDireito', value: novaConsultaFormData.antibracoDireito },
    { label: 'Coxa Esquerda (cm)', name: 'coxaEsquerda', value: novaConsultaFormData.coxaEsquerda },
    { label: 'Coxa Direita (cm)', name: 'coxaDireita', value: novaConsultaFormData.coxaDireita },
    { label: 'Panturrilha Esquerda (cm)', name: 'panturrilhaEsquerda', value: novaConsultaFormData.panturrilhaEsquerda },
    { label: 'Panturrilha Direita (cm)', name: 'panturrilhaDireita', value: novaConsultaFormData.panturrilhaDireita },
    { label: 'Pescoço (cm)', name: 'pescoco', value: novaConsultaFormData.pescoco },
  ];

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

      {/* Modal de Agendamento/Criação usando ModalConsulta genérico */}
      <ModalConsulta
        isOpen={isModalCriarConsultaOpen} // Controla a visibilidade
        onClose={fecharModalCriarConsulta} // Chamado ao fechar o modal
        title="Agendar Nova Consulta" // Título do modal
      >
        {/* O conteúdo do modal é o formulário completo */}
        <form onSubmit={handleCriarNovaConsultaSubmit} className="space-y-4">
          {formError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
              {formError}
            </div>
          )}

          {/* IDs e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="planoId" className="block text-sm font-medium text-gray-700 mb-1">
                ID do Paciente <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="planoId" // Usando planoId aqui para mapear para pacienteId no DTO
                name="planoId"
                value={novaConsultaFormData.planoId}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={usuario?.tipoUsuario === "Paciente"}
                placeholder={usuario?.tipoUsuario === "Paciente" ? "Seu ID" : "ID do Paciente"}
              />
            </div>
            <div>
              <label htmlFor="profissionalSaudeId" className="block text-sm font-medium text-gray-700 mb-1">
                ID do Profissional <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="profissionalSaudeId"
                name="profissionalSaudeId"
                value={novaConsultaFormData.profissionalSaudeId}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={usuario?.tipoUsuario === "Nutricionista" || usuario?.tipoUsuario === "EducadorFisico"}
                placeholder={(usuario?.tipoUsuario === "Nutricionista" || usuario?.tipoUsuario === "EducadorFisico") ? "Seu ID" : "ID do Profissional"}
              />
            </div>
          </div>

          <div>
            <label htmlFor="dataConsulta" className="block text-sm font-medium text-gray-700 mb-1">
              Data e Hora da Consulta <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="dataConsulta"
              name="dataConsulta"
              value={novaConsultaFormData.dataConsulta}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Peso, Altura, Refeições */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="peso"
                name="peso"
                value={novaConsultaFormData.peso}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ex: 70.5"
              />
            </div>
            <div>
              <label htmlFor="altura" className="block text-sm font-medium text-gray-700 mb-1">
                Altura (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="altura"
                name="altura"
                value={novaConsultaFormData.altura}
                onChange={handleInputChange}
                required
                step="0.1"
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ex: 175"
              />
            </div>
            <div>
              <label htmlFor="numeroRefeicoes" className="block text-sm font-medium text-gray-700 mb-1">
                Nº de Refeições <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="numeroRefeicoes"
                name="numeroRefeicoes"
                value={novaConsultaFormData.numeroRefeicoes}
                onChange={handleInputChange}
                required
                step="1"
                min="1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ex: 5"
              />
            </div>
          </div>

          {/* Seção de Medidas */}
          <h3 className="text-lg font-medium text-gray-800 pt-2 border-t mt-6">Medidas Corporais (Opcional)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {camposMedidas.map(campo => (
              <div key={campo.name}>
                <label htmlFor={campo.name} className="block text-sm font-medium text-gray-700 mb-1">
                  {campo.label}
                </label>
                <input
                  type="number"
                  id={campo.name}
                  name={campo.name}
                  value={campo.value}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Opcional"
                />
              </div>
            ))}
          </div>

          {/* Campo de Observações Gerais */}

          {/* Botões de Ação do formulário - dentro do ModalConsulta */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={fecharModalCriarConsulta}
              disabled={criandoConsulta}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={criandoConsulta}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-indigo-400"
            >
              {criandoConsulta ? 'Agendando...' : 'Agendar Consulta'}
            </button>
          </div>
        </form>
      </ModalConsulta>
    </div>
  );
}