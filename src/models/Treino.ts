import type { Consulta } from "./Consulta";
import type { ExecucaoExercicio } from "./ExecucaoExercicio";

export interface Treino {
  id: string;
  nome: string;
  dataTreino: string;
  consulta: Consulta;
  educadorFisico: string;
  treinoExercicios: ExecucaoExercicio[];
  validadeProjeto: string;
  tempo: "TRINTA" | "SESSENTA" | "CENTO_VINTE"; 
}