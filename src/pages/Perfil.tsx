import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ModalEdicao from "../components/ModalPerfil";

export default function Perfil() {
  const { usuario, setUsuario } = useAuth(); // garantir que você pode setar
  const [campoSelecionado, setCampoSelecionado] = useState<string | null>(null);

  if (!usuario) {
    return <p>Carregando ou usuário não autenticado.</p>;
  }

  const abrirModal = (campo: string) => {
    setCampoSelecionado(campo);
  };

  const fecharModal = () => {
    setCampoSelecionado(null);
  };

  const obterValorAtual = (campo: string): string | number => {
    const partes = campo.split(".");
    let valor: any = usuario;

    for (const parte of partes) {
      valor = valor?.[parte];
    }

    return valor;
  };

  const salvarValor = (campo: string, novoValor: string | number) => {
    const partes = campo.split(".");
    const novoUsuario = { ...usuario };

    let alvo: any = novoUsuario;
    for (let i = 0; i < partes.length - 1; i++) {
      alvo = alvo[partes[i]];
    }

    alvo[partes[partes.length - 1]] = novoValor;
    setUsuario(novoUsuario);
    fecharModal();
  };

  const renderItem = (label: string, campo: string) => (
    <div style={infoItem}>
      <strong>{label}:</strong> {obterValorAtual(campo)}{" "}
      <button onClick={() => abrirModal(campo)} style={editButtonStyle}>
        ✏️
      </button>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
          Perfil do Usuário
        </h2>

        {renderItem("Nome", "nome")}
        {renderItem("Sobrenome", "sobrenome")}
        {renderItem("Email", "email")}
        {renderItem("CPF", "cpf")}
        {renderItem("Telefone", "telefone")}
        {renderItem("Sexo", "sexo")}
        {renderItem("Data de Nascimento", "dataNascimento")}
        {renderItem("CEP", "endereco.cep")}
        {renderItem("Número", "endereco.numero")}
        {renderItem("Complemento", "endereco.complemento")}
        {renderItem("Tipo de Usuário", "tipoUsuario")}
        
        {campoSelecionado && (
          <ModalEdicao
            campo={campoSelecionado}
            valor={obterValorAtual(campoSelecionado)}
            onClose={fecharModal}
            onSalvar={salvarValor}
          />
        )}
      </div>
    </div>
  );
}

// Estilos
const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
  backgroundColor: "#f4f4f4",
  boxSizing: "border-box",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  minWidth: "320px",
};

const infoItem: React.CSSProperties = {
  marginBottom: "0.8rem",
};

const editButtonStyle: React.CSSProperties = {
  marginLeft: "0.5rem",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
};
