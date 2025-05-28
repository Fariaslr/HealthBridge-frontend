import type { Pessoa } from "./Pessoa";

export interface Nutricionista extends Pessoa {
  crn: string;
}