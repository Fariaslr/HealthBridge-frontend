import type { ProfissionalSaude } from "./ProfissionalSaude";

export interface Nutricionista extends ProfissionalSaude {
    tipoUsuario: "Nutricionista";
    crn: string | null; 
}