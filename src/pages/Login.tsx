import { useState } from "react";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const { setUsuario } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(email, senha);
      setUsuario(user);  // salva globalmente no contexto
      console.log("Usuário logado:", user);
      // aqui pode redirecionar para a página principal, ex:
      // navigate('/home');
    } catch (err: any) {
      setErro(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />
      <button type="submit">Entrar</button>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </form>
  );
}
