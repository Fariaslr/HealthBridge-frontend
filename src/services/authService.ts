import axios from "axios";
import type { Pessoa } from "../models/Pessoa";



export async function login(email: string, senha: string): Promise<Pessoa> {
  const response = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });

  if (!response.ok) {
    throw new Error("Email ou senha inválidos");
  }

  return response.json();
}


export async function cadastrar(dados: any) {
  const response = await axios.post("http://localhost:8080/pessoas", dados);
  return response.data;
}