// mockPessoa.ts
import type { Pessoa } from "../models/Pessoa";

export const users: Pessoa[] = [{
    id: "1",
    cpf: "12345678900",
    nome: "Lucas",
    sobrenome: "Farias",
    telefone: "11999999999",
    usuario: "lucasf",
    email: "lucas@email.com",
    senha: "1234",
    dataNascimento: "1995-01-01",
    sexo: "MASCULINO", // precisa estar dentro do enum Sexo
    tipoUsuario: "Paciente", // "Paciente" | "Nutricionista" | "EducadorFisico"
    endereco: {
        cep: "12345-678",
        complemento: "Apto 101",
        numero: 100,
    },
    plano: {
        id: "plano1",
        paciente: {} as Pessoa, // evita recursão infinita
        objetivo: "EMAGRECIMENTO",    // se Objetivo for outro enum/tipo, pode simular
        nivelAtividadeFisica: {} as any, // idem
        profissionalSaude: {} as Pessoa, // mock vazio
        dataCriacao: "2025-01-01",
        dataAtualizacao: "2025-01-10",
    },
}]
