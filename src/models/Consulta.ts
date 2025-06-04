import type { Plano } from "./Plano";
import type { ProfissionalSaude } from "./ProfissionalSaude";

export interface Consulta {
    id: string;
    plano: Plano;
    profissionalSaude: ProfissionalSaude;
    peso: number;
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
    links?: Array<{ rel: string; href: string }>;

    // REMOVER métodos que Jackson expõe como propriedades
    // medidaAntibraço?: string; // REMOVER
    // medidaPanturrilha?: string; // REMOVER
    // medidaBraço?: string; // REMOVER
    // medidaCoxa?: string; // REMOVER
}