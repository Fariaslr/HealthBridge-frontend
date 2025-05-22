import type { NivelAtividadeFisica } from "./NivelAtividadeFisica";
import type { Objetivo } from "./Objetivo";
import type { Pessoa } from "./Pessoa";

export type Plano = {
  id: string;
  paciente: Pessoa; // referência circular
  dataPlano: string; // formato ISO vindo do backend
  objetivo: Objetivo;
  nivelAtividadeFisica: NivelAtividadeFisica ;
  profissionalSaude: Pessoa;
  //consultas: Consulta[];
};
