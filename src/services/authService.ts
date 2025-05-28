// src/services/authService.ts
import axios from "axios";
import type { Pessoa } from "../models/Pessoa"; // Tipo de retorno: a entidade completa
import type { CadastroInput, EducadorFisicoInput, NutricionistaInput, PacienteInput, TipoCadastro } from "../types/cadastroTypes";

const API_BASE = "http://localhost:8080";

// Exemplo da função de login (usando axios e API_BASE para consistência)
export async function login(email: string, senha: string): Promise<Pessoa> {
  const response = await axios.post<Pessoa>(`${API_BASE}/auth/login`, { email, senha });
  return response.data;
}

// Funções para cadastrar tipos específicos de usuário
// Agora recebem os tipos de *Input* correspondentes
export async function cadastrarPaciente(dados: PacienteInput): Promise<Pessoa> {
  const response = await axios.post<Pessoa>(`${API_BASE}/pacientes`, dados);
  return response.data;
}

export async function cadastrarEducadorFisico(dados: EducadorFisicoInput): Promise<Pessoa> {
  const response = await axios.post<Pessoa>(`${API_BASE}/educadoresfisicos`, dados);
  return response.data;
}

export async function cadastrarNutricionista(dados: NutricionistaInput): Promise<Pessoa> {
  const response = await axios.post<Pessoa>(`${API_BASE}/nutricionistas`, dados);
  return response.data;
}

// Função unificada para a página de cadastro
// Recebe o tipo de cadastro e os dados de entrada genéricos `CadastroInput`
export async function cadastrarUsuario(tipo: TipoCadastro, dados: CadastroInput): Promise<Pessoa> {
  switch (tipo) {
    case "PACIENTE":
      return cadastrarPaciente(dados as PacienteInput); // Cast para o tipo de input específico
    case "EDUCADOR_FISICO":
      return cadastrarEducadorFisico(dados as EducadorFisicoInput);
    case "NUTRICIONISTA":
      return cadastrarNutricionista(dados as NutricionistaInput);
    default:
      throw new Error("Tipo de cadastro inválido.");
  }
}