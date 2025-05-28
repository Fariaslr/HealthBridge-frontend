import type { NivelAtividadeFisica } from "./NivelAtividadeFisica";
import type { Objetivo } from "./Objetivo";
import type { Pessoa } from "./Pessoa";

export type Plano = {
  id: string;
  paciente: Pessoa;
  objetivo: Objetivo;
  nivelAtividadeFisica: NivelAtividadeFisica;
  profissionalSaude: Pessoa;
  dataCriacao: string;
  dataAtualizacao: string;
  //consultas : Consulta[]
};