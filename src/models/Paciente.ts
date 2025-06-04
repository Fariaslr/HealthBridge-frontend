import type { Pessoa } from "./Pessoa";
import type { Plano } from "./Plano";

export interface Paciente extends Pessoa {
    plano: Plano | null;
}