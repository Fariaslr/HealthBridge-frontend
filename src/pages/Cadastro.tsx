import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cadastrarUsuario } from "../services/authService";
import type { PessoaBaseInput, TipoCadastro } from "../types/cadastroTypes";


const initialSimplifiedState: PessoaBaseInput = {
  nome: "",
  sobrenome: "",
  email: "",
  senha: "",
  telefone: "99999999999",
  cpf: "11122233344",
  dataNascimento: "2000-01-01",
  sexo: "NAO_INFORMADO", 
  cep: "12345-678",
  numero: "123",
  complemento: "Apto 101",
};

export default function Cadastro() {
  const navigate = useNavigate();

  const [tipoCadastro, setTipoCadastro] = useState<TipoCadastro>("PACIENTE");
  const [formData, setFormData] = useState<
    PessoaBaseInput & { cref?: string; crn?: string }
  >(initialSimplifiedState);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTipoCadastroChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newType = e.target.value as TipoCadastro;
    setTipoCadastro(newType);
    setFormData(initialSimplifiedState); // Reinicia com os valores padrão simplificados
    setErro("");
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      if (!formData.nome.trim()) {
        throw new Error("O nome é obrigatório.");
      }
      if (!formData.email.trim()) {
        throw new Error("O email é obrigatório.");
      }
      if (!formData.senha.trim()) {
        throw new Error("A senha é obrigatória.");
      }

      if (tipoCadastro === "EDUCADOR_FISICO" && !formData.cref?.trim()) {
        throw new Error("O CREF é obrigatório para Educador Físico.");
      }
      if (tipoCadastro === "NUTRICIONISTA" && !formData.crn?.trim()) {
        throw new Error("O CRN é obrigatório para Nutricionista.");
      }

      await cadastrarUsuario(tipoCadastro, formData);

      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (err: any) {
      console.error("Erro no cadastro:", err);
      setErro(err.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleCadastro} style={formStyle} autoComplete="off">
        <h2 style={titleStyle}>Cadastro Simplificado</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="tipoCadastro">Sou um(a):</label>
          <select
            id="tipoCadastro"
            value={tipoCadastro}
            onChange={handleTipoCadastroChange}
            style={{ ...inputStyle, marginLeft: 10, width: "auto" }}
          >
            <option value="PACIENTE">Paciente</option>
            <option value="EDUCADOR_FISICO">Educador Físico</option>
            <option value="NUTRICIONISTA">Nutricionista</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
          autoComplete="new-email"
        />
        <input
          type="password"
          placeholder="Senha"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
          required
          style={inputStyle}
          autoComplete="new-password"
        />

        {tipoCadastro === "EDUCADOR_FISICO" && (
          <input
            type="text"
            placeholder="CREF"
            name="cref"
            value={formData.cref || ""}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        )}

        {tipoCadastro === "NUTRICIONISTA" && (
          <input
            type="text"
            placeholder="CRN"
            name="crn"
            value={formData.crn || ""}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        )}

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
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