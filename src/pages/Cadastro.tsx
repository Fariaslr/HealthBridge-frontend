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
    <div style={containerStyle}>
      <form onSubmit={handleCadastro} style={formStyle} autoComplete="off">
        <h2 style={titleStyle}>Cadastro</h2>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Sobrenome"
          value={sobrenome}
          onChange={(e) => setSobrenome(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
          autoComplete="new-email"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          style={inputStyle}
          autoComplete="new-password"
        />

        <button type="submit" style={buttonStyle}>
          Cadastrar
        </button>
        {erro && <p style={errorStyle}>{erro}</p>}
        <p style={signupTextStyle}>
          Já tem uma conta?{" "}
          <Link to="/login" style={linkStyle}>
            Faça login
          </Link>
        </p>
      </form>
    </div>
  );
}

// Mesmos estilos do Login para manter padrão
const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
  backgroundColor: "#f0f2f5",
};

const formStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  minWidth: "320px",
  maxWidth: "400px",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const titleStyle: React.CSSProperties = {
  marginBottom: "1.5rem",
  textAlign: "center",
  color: "#333",
};

const inputStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  fontSize: "1rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  outline: "none",
  transition: "border-color 0.2s",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  backgroundColor: "#28a745",
  color: "#fff",
  fontWeight: "bold",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const errorStyle: React.CSSProperties = {
  color: "red",
  fontSize: "0.9rem",
  textAlign: "center",
};

const signupTextStyle: React.CSSProperties = {
  marginTop: "1rem",
  fontSize: "0.9rem",
  textAlign: "center",
  color: "#555",
};

const linkStyle: React.CSSProperties = {
  color: "#28a745",
  textDecoration: "none",
  fontWeight: "bold",
};
