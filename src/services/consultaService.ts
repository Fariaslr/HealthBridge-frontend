import axios from "axios";
import type { Consulta } from "../models/Consulta";


const API_BASE = "http://localhost:8080"; 

export type ConsultaRecordDto = {
  planoId: string,                     
  peso: number;
  altura: number;       
  profissionalSaudeId: string;
};

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

export async function buscarConsultasPorPacienteId(pacienteId: string): Promise<Consulta[]> {
  const response = await axios.get<Consulta[]>(`${API_BASE}/consultas/paciente/${pacienteId}`);
  return response.data;
}

export async function buscarConsultasPorProfissionalSaudeId(profissionalSaudeId: string): Promise<Consulta[]> {
  const response = await axios.get<Consulta[]>(`${API_BASE}/consultas/profissional/${profissionalSaudeId}`);
  return response.data;
}