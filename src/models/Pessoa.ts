import type { Endereco } from "./Endereco";
import type { Plano } from "./Plano";
import type { Sexo } from "./Sexo";

export type Pessoa = {
  id: string;
  cpf: string;
  nome: string;
  sobrenome: string;
  telefone: string;
  usuario: string;
  email: string;
  dataNascimento: string;
  sexo: Sexo;
  tipoUsuario: "Paciente" | "Nutricionista" | "EducadorFisico";
  endereco: Endereco;
  plano: Plano;
};
