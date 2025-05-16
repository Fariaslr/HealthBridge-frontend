export interface LoginResponse {
  id: string;
  nome: string;
  email: string;
}

export async function login(email: string, senha: string): Promise<LoginResponse> {
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
