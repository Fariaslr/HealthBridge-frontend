import axios from "axios";
import type { Treino } from "../models/Treino";

const API_BASE = "http://localhost:8080";

export type TreinoRecordDto = {
  consultaId: string;
  educadorFisico: string;
  tempo: "TRINTA" | "SESSENTA" | "CENTO_VINTE";
  dataTreino?: string; 
};

export async function listarTreinos(): Promise<Treino[]> {
  const response = await axios.get<Treino[]>(`${API_BASE}/treinos`);
  return response.data;
}

export async function buscarTreinoPorId(id: string): Promise<Treino> {
  const response = await axios.get<Treino>(`${API_BASE}/treinos/${id}`);
  return response.data;
}

export async function criarTreino(dto: TreinoRecordDto): Promise<Treino> {
  const response = await axios.post<Treino>(`${API_BASE}/treinos`, dto);
  return response.data;
}

export async function atualizarTreino(id: string, dto: Partial<TreinoRecordDto>): Promise<Treino> {
  const response = await axios.put<Treino>(`${API_BASE}/treinos/${id}`, dto);
  return response.data;
}

export async function deletarTreino(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/treinos/${id}`);
}

export async function buscarTreinosPorProfissional(profissionalId: string): Promise<Treino[]> {
  const response = await axios.get<Treino[]>(`${API_BASE}/treinos/profissional/${profissionalId}`);
  return response.data;
}

export async function buscarTreinosPorPaciente(pacienteId: string): Promise<Treino[]> {
  const response = await axios.get<Treino[]>(`${API_BASE}/treinos/paciente/${pacienteId}`);
  return response.data;
}
