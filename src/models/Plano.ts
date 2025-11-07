import type { NivelAtividadeFisica } from "./NivelAtividadeFisica";
import type { Objetivo } from "./Objetivo";
import type { Pessoa } from "./Pessoa";
import type { ProfissionalSaude } from "./ProfissionalSaude";

export type Plano = {
  id: string;
  paciente: Pessoa;
  objetivo: Objetivo;
  nivelAtividadeFisica: NivelAtividadeFisica;
  profissionalSaude: ProfissionalSaude;
  dataCriacao: string;
  dataAtualizacao: string;
  //consultas : Consulta[]
};