import type { Pessoa } from "./Pessoa";
import type { ProfissionalSaude } from "./ProfissionalSaude";

export interface Nutricionista extends ProfissionalSaude {
  crn: string;
}