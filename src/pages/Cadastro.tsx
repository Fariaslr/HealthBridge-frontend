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
  cep: "",
  numero: "",
  complemento: "",
};

export default function Cadastro() {
  const navigate = useNavigate();

  // --- CORREÇÃO: Mova a declaração do useState para AQUI ---
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [tipoCadastro, setTipoCadastro] = useState<TipoCadastro>("PACIENTE");
  const [formData, setFormData] = useState<
    PessoaBaseInput & { cref?: string; crn?: string }
  >(initialSimplifiedState);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  // --- FIM DA CORREÇÃO ---

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // O tipo do evento para handleChange deve ser mais genérico para lidar com confirmarSenha
    // ou use uma função separada
    if (name === "confirmarSenha") {
      setConfirmarSenha(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTipoCadastroChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newType = e.target.value as TipoCadastro;
    setTipoCadastro(newType);
    setFormData(initialSimplifiedState);
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
      if (formData.senha !== confirmarSenha) {
        throw new Error("As senhas não coincidem.");
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
        <h2 style={titleStyle}>Cadastro</h2>

        {/* Seleção do Tipo de Cadastro */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="tipoCadastro" style={labelStyle}>
            Sou um(a):
          </label>
          <select
            id="tipoCadastro"
            name="tipoCadastro"
            value={tipoCadastro}
            onChange={handleTipoCadastroChange}
            style={selectStyle}
          >
            <option value="PACIENTE">Paciente</option>
            <option value="EDUCADOR_FISICO">Educador Físico</option>
            <option value="NUTRICIONISTA">Nutricionista</option>
          </select>
        </div>

        {/* Divisão 1: Informações Pessoais */}
        <h3 style={sectionTitleStyle}>Informações Pessoais</h3>
        <div style={formRowStyle}>
          <div style={formGroupStyle}>
            <label htmlFor="nome" style={labelStyle}>
              Nome
            </label>
            <input
              id="nome"
              type="text"
              name="nome"
              placeholder="João"
              value={formData.nome}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="sobrenome" style={labelStyle}>
              Sobrenome
            </label>
            <input
              id="sobrenome"
              type="text"
              name="sobrenome"
              placeholder="Silva"
              value={formData.sobrenome}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
        </div>
        <div style={formRowStyle}>
          <div style={formGroupStyle}>
            <label htmlFor="dataNascimento" style={labelStyle}>
              Data de Nascimento
            </label>
            <input
              id="dataNascimento"
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="sexo" style={labelStyle}>
              Sexo
            </label>
            <select
              id="sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="NAO_INFORMADO">Não Informado</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMININO">Feminino</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>
        </div>

        <h3 style={sectionTitleStyle}>Endereço</h3>
        <div style={formRowStyle}>
          <div style={formGroupStyle}>
            <label htmlFor="cep" style={labelStyle}>
              CEP
            </label>
            <input
              id="cep"
              type="text"
              name="cep"
              placeholder="42000-000"
              value={formData.cep}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="numero" style={labelStyle}>
              Número
            </label>
            <input
              id="numero"
              type="text"
              name="numero"
              placeholder="Ex. 123"
              value={formData.numero}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="complemento" style={labelStyle}>
            Complemento
          </label>
          <input
            id="complemento"
            type="text"
            name="complemento"
            placeholder="Apto, Bloco, etc."
            value={formData.complemento}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <h3 style={sectionTitleStyle}>Dados de Acesso</h3>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
          autoComplete="email"
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

        <input
          type="password"
          placeholder="Confirmar Senha"
          name="confirmarSenha"
          value={confirmarSenha}
          onChange={handleChange} // Usa a mesma função handleChange
          required
          style={inputStyle}
        />

        {/* Campos Condicionais */}
        {(tipoCadastro === "EDUCADOR_FISICO" ||
          tipoCadastro === "NUTRICIONISTA") && (
          <>
            <h3 style={sectionTitleStyle}>Informações Profissionais</h3>
            <div style={formRowStyle}>
              {tipoCadastro === "EDUCADOR_FISICO" && (
                <div style={formGroupStyle}>
                  <label htmlFor="cref" style={labelStyle}>
                    CREF
                  </label>
                  <input
                    id="cref"
                    type="text"
                    name="cref"
                    value={formData.cref || ""}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>
              )}
              {tipoCadastro === "NUTRICIONISTA" && (
                <div style={formGroupStyle}>
                  <label htmlFor="crn" style={labelStyle}>
                    CRN
                  </label>
                  <input
                    id="crn"
                    type="text"
                    name="crn"
                    value={formData.crn || ""}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>
              )}
            </div>
          </>
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
  minHeight: "100vh",
  width: "100vw",
  backgroundColor: "#f0f2f5",
  padding: "20px 0",
};

const formStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  minWidth: "320px",
  maxWidth: "600px",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const formRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
};

const formGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
};

const titleStyle: React.CSSProperties = {
  marginBottom: "1rem",
  textAlign: "center",
  color: "#333",
};

const sectionTitleStyle: React.CSSProperties = {
  marginTop: "1rem",
  marginBottom: "0.5rem",
  color: "#555",
  borderBottom: "1px solid #ddd",
  paddingBottom: "0.5rem",
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

const labelStyle: React.CSSProperties = {
  fontWeight: "bold",
  color: "#333",
  marginBottom: "0.5rem",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  marginLeft: "10px",
  width: "auto",
};