import axios from "axios";
import type { Pessoa } from "../models/Pessoa";
import type { AuthUser } from "../context/AuthContext";

const API_BASE = "http://localhost:8080";

export type PessoaUpdateDto = {
    nome: string;
    sobrenome: string;
    email?: string | null;
    telefone?: string | null;
    cpf?: string | null;
    sexo?: string | null;
    dataNascimento?: string | null;
    cref?: string | null;
    crn?: string | null;
    cep?: string | null;
    numero?: string | null;
    complemento?: string | null;
};


export async function atualizarPessoa(id: string, dto: PessoaUpdateDto): Promise<AuthUser> {
    const response = await axios.put<Pessoa>(`${API_BASE}/pessoas/${id}`, dto); 
    
    return response.data;
}