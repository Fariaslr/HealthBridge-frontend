import axios from "axios"; // Paciente e ProfissionalSaude estendem Pessoa
import type { Plano } from "../models/Plano";

const API_BASE = "http://localhost:8080"; 

export type PlanoRecordDto = {
  paciente: string;
  objetivo: string;
  nivelAtividadeFisica: string; 
  profissionalSaude: string;
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

export async function atualizarPlano(id: string, dto: PlanoRecordDto): Promise<Plano> {
  const response = await axios.put<Plano>(`${API_BASE}/planos/${id}`, dto);
  return response.data;
}

export async function deletarPlano(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/planos/${id}`);
}

export async function buscarPlanosPorProfissional(profissionalId: string): Promise<Plano[]> {
  const response = await axios.get<Plano[]>(`${API_BASE}/planos/profissional/${profissionalId}`);
  return response.data;
}

export async function buscarPlanoPorPacienteId(pacienteId: string): Promise<Plano> {
  const response = await fetch(`/planos/paciente/${pacienteId}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar plano");
  }
  return response.json();
}
