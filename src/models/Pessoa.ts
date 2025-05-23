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
  dataNascimento: string; // será uma string ISO ao vir do backend
  sexo: Sexo;
  tipoUsuario: string;
  endereco: Endereco;
  plano: Plano;
};
