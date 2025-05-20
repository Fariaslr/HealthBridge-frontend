import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cadastrar } from "../services/authService";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cadastrar({
        nome,
        sobrenome,
        email,
        senha,
        dataNascimento: "2001-01-01", // Pode ajustar conforme seu modelo
        sexo: "MASCULINO", // Pode ajustar conforme seu modelo
      });
      setErro("");
      alert("Cadastro realizado com sucesso!");
      navigate("/login"); // volta para login após cadastro
    } catch (err: any) {
      setErro(err.message || "Erro ao cadastrar");
    }
  };

  return (
    <div>
      <h2>Cadastro</h2>
      <form onSubmit={handleCadastro}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Sobrenome"
          value={sobrenome}
          onChange={(e) => setSobrenome(e.target.value)}
          required
        />
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
        <button type="submit">Cadastrar</button>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </form>
      <p>
        Já tem uma conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  );
}
