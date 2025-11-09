import axios from "axios";
import type { Pessoa } from "../models/Pessoa";
import type { AuthUser } from "../context/AuthContext";

const API_BASE = "http://localhost:8080";

export type PessoaUpdateDto = {
    nome: string;
    sobrenome: string;
    telefone?: string | null;
    [key: string]: any; 
};

export async function atualizarPessoa(id: string, dto: PessoaUpdateDto): Promise<AuthUser> {
    const response = await axios.put<Pessoa>(`${API_BASE}/pessoas/${id}`, dto); 
    
    return response.data;
}