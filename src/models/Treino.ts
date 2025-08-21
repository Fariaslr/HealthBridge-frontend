import type { Consulta } from "./Consulta";
import type { ExecucaoExercicio } from "./ExecucaoExercicio";

export interface Treino {
  id: string;
  dataTreino: string;
  consulta: Consulta;
  educadorFisico: string;
  treinoExercicios: ExecucaoExercicio[];
  tempo: "CURTO_PRAZO" | "MEDIO_PRAZO" | "LONGO_PRAZO"; 
}