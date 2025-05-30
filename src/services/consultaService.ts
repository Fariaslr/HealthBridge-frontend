// src/services/consultaService.ts
import axios from "axios";
import type { Consulta } from "../models/Consulta";


const API_BASE = "http://localhost:8080"; // A URL base da sua API

export type ConsultaRecordDto = {
  dataHora: string; 
  observacoes?: string; 
  pacienteId: string;
  profissionalSaudeId: string;
};

// Funções para interagir com a API de Consultas
export async function listarConsultas(): Promise<Consulta[]> {
  const response = await axios.get<Consulta[]>(`${API_BASE}/consultas`);
  return response.data;
}

export async function buscarConsultaPorId(id: string): Promise<Consulta> {
  const response = await axios.get<Consulta>(`${API_BASE}/consultas/${id}`);
  return response.data;
}

export async function criarConsulta(dto: ConsultaRecordDto): Promise<Consulta> {
  const response = await axios.post<Consulta>(`${API_BASE}/consultas`, dto);
  return response.data;
}

export async function atualizarConsulta(id: string, dto: ConsultaRecordDto): Promise<Consulta> {
  const response = await axios.put<Consulta>(`${API_BASE}/consultas/${id}`, dto);
  return response.data;
}

export async function deletarConsulta(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/consultas/${id}`);
}

// Funções específicas para buscar consultas de um paciente ou profissional
export async function buscarConsultasPorPacienteId(pacienteId: string): Promise<Consulta[]> {
  const response = await axios.get<Consulta[]>(`${API_BASE}/consultas/paciente/${pacienteId}`);
  return response.data;
}

export async function buscarConsultasPorProfissionalSaudeId(profissionalSaudeId: string): Promise<Consulta[]> {
  const response = await axios.get<Consulta[]>(`${API_BASE}/consultas/profissional/${profissionalSaudeId}`);
  return response.data;
}