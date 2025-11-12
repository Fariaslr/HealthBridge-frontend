import type { Consulta } from "./Consulta";
import type { ExecucaoExercicio } from "./ExecucaoExercicio";

export interface Treino {
  id: string;
  dataTreino: string;
  consulta: Consulta;
  educadorFisico: string;
  treinoExercicios: ExecucaoExercicio[];
  tempo: "TRINTA" | "SESSENTA" | "CENTO_VINTE"; 
}