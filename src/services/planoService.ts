// src/services/planoService.ts
import axios from "axios";
import type { Plano } from "../models/Plano";

const API_BASE = "http://localhost:8080";

export type PlanoRecordDto = {
  pacienteId: string;
  objetivo: string;
  nivelAtividadeFisica: string;
  profissionalSaudeId: string;
};

export async function listarPlanos(): Promise<Plano[]> {
  const response = await axios.get<Plano[]>(`${API_BASE}/planos`);
  return response.data;
}

export async function buscarPlanoPorId(id: string): Promise<Plano> {
  const response = await axios.get<Plano>(`${API_BASE}/planos/${id}`);
  return response.data;
}

export async function criarPlano(dto: PlanoRecordDto): Promise<Plano> {
  const response = await axios.post<Plano>(`${API_BASE}/planos`, dto);
  return response.data;
}

export async function atualizarPlano(id: string, dto: Partial<PlanoRecordDto>): Promise<Plano> {
  const response = await axios.put<Plano>(`${API_BASE}/planos/${id}`, dto); 
  return response.data;
}
// --- FIM DA CORREÇÃO ---

export async function deletarPlano(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/planos/${id}`);
}

export async function buscarPlanosPorProfissional(profissionalId: string): Promise<Plano[]> {
  const response = await axios.get<Plano[]>(`${API_BASE}/planos/profissional/${profissionalId}`);
  return response.data;
}

export async function buscarPlanoPorPacienteId(pacienteId: string): Promise<Plano | null> { // Adicionado | null para o retorno
  try {
    const response = await axios.get<Plano>(`${API_BASE}/planos/paciente/${pacienteId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) { // Se for 404, retorna null
        console.warn(`Plano para o paciente ID ${pacienteId} não encontrado (404).`);
        return null;
      }
      throw new Error(error.response.data.message || `Erro ao buscar plano: Status ${error.response.status}`);
    } else {
      throw new Error("Erro ao buscar plano: " + (error as Error).message);
    }
  }
}