import type { Plano } from "./Plano";
import type { ProfissionalSaude } from "./ProfissionalSaude";
import type { Treino } from "./Treino";

export interface Consulta {
    id: string;
    plano: Plano;
    profissionalSaude: ProfissionalSaude;
    peso: number;
    treino: Treino;
    altura: number;
    numeroRefeicoes: number;
    torax: number | null;
    abdomen: number | null;
    cintura: number | null;
    quadril: number | null;
    bracoEsquerdo: number | null;
    bracoDireito: number | null;
    antibracoEsquerdo: number | null;
    antibracoDireito: number | null;
    coxaEsquerda: number | null;
    coxaDireita: number | null;
    panturrilhaEsquerda: number | null;
    panturrilhaDireita: number | null;
    pescoco: number | null;
    observacoes: string | null;
    dataCriacao: string;
    dataAtualizacao: string;
    medidaAntibraço?: string;
    medidaPanturrilha?: string;
    medidaBraço?: string;
    medidaCoxa?: string;
    caloriasDiarias?: number;
    aguaDiaria?: number;
    taxaBasal?: number;
}