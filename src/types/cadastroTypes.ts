import type { Sexo } from "../models/Sexo";

export interface PessoaBaseInput {
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
  telefone: string;
  cpf: string;
  dataNascimento: string; 
  sexo: Sexo | ""; 
  cep: string;
  numero: string;
  complemento: string;
}

export interface PacienteInput extends PessoaBaseInput {}

export interface EducadorFisicoInput extends PessoaBaseInput {
  cref: string;
}

export interface NutricionistaInput extends PessoaBaseInput {
  crn: string;
}

export type CadastroInput = PacienteInput | EducadorFisicoInput | NutricionistaInput;

export type TipoCadastro = "PACIENTE" | "EDUCADOR_FISICO" | "NUTRICIONISTA";