import type { ProfissionalSaude } from "./ProfissionalSaude";

export interface EducadorFisico extends ProfissionalSaude {
    tipoUsuario: "EducadorFisico";
    cref: string | null; 
}