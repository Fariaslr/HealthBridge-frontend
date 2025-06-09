import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Pessoa } from "../models/Pessoa";
import { login } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const { setUsuario } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = (await login(email, senha)) as Pessoa;
      setUsuario(user);
      setErro("");
      navigate("/home");
      console.log(user.tipoUsuario)
    } catch (err: any) {
      setErro(err.message || "Erro ao fazer login");
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        <h2 style={titleStyle}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Entrar
        </button>
        {erro && <p style={errorStyle}>{erro}</p>}
        <p style={signupTextStyle}>
          Ainda não tem uma conta?{" "}
          <Link to="/cadastro" style={linkStyle}>
            Cadastre-se aqui
          </Link>
        </p>
      </form>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
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
  backgroundColor: "#007bff",
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
  color: "#007bff",
  textDecoration: "none",
  fontWeight: "bold",
};

