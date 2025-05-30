// src/models/Consulta.ts
import type { Paciente } from "./Paciente"; // Ou Pessoa, se for o tipo base
import type { ProfissionalSaude } from "./ProfissionalSaude";


export type Consulta = {
  id: string;
  dataHora: string;
  observacoes: string;
  paciente: Paciente; 
  profissionalSaude: ProfissionalSaude; 
  dataCriacao: string;
  dataAtualizacao: string;
};