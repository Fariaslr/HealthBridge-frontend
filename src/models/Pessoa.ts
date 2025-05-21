export type Sexo = "MASCULINO" | "FEMININO" | "OUTRO"; // baseado no seu Enum em Java

export type Endereco = {
  cep: string;
  complemento: string;
  numero: number;
};

export type Pessoa = {
  id: string;
  cpf: string;
  nome: string;
  sobrenome: string;
  telefone: string;
  usuario: string;
  email: string;
  senha?: string; // opcional para evitar expor desnecessariamente
  dataNascimento: string; // será uma string ISO ao vir do backend
  sexo: Sexo;
  endereco: Endereco;
};
