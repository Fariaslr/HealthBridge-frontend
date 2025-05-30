import axios from "axios";
import type { Pessoa } from "../models/Pessoa"; 
import type { CadastroInput, EducadorFisicoInput, NutricionistaInput, PacienteInput, TipoCadastro } from "../types/cadastroTypes";

const API_BASE = "http://localhost:8080";

export async function login(email: string, senha: string): Promise<Pessoa> {
  try {
    const response = await axios.post<Pessoa>(`${API_BASE}/auth/login`, { email, senha });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        const errorMessage = error.response.data?.message || "Email ou senha inválidos.";
        throw new Error(errorMessage);
      } else if (error.response.status === 403) {
        throw new Error("Acesso negado.");
      } else {
        throw new Error(`Erro de autenticação: ${error.response.statusText || "Erro desconhecido"}`);
      }
    } else {
      throw new Error("Erro de conexão. Verifique sua rede.");
    }
  }
}

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