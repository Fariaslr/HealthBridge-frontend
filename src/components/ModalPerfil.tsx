import React from "react";

interface ModalEdicaoProps {
  campo: string; // Ex: 'email', 'telefone', 'endereco.numero', etc.
  valor: string | number;
  onClose: () => void;
  onSalvar: (campo: string, novoValor: string | number) => void;
}

export default function ModalEdicao({
  campo,
  valor,
  onClose,
  onSalvar,
}: ModalEdicaoProps) {
  const [novoValor, setNovoValor] = React.useState(valor);

  const isCampoSexo = campo === "sexo";

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Editar {campo}</h3>

        {isCampoSexo ? (
          <select
            value={novoValor}
            onChange={(e) => setNovoValor(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          >
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
            <option value="OUTRO">Outro</option>
          </select>
        ) : (
          <input
            type={typeof valor === "number" ? "number" : "text"}
            value={novoValor}
            onChange={(e) =>
              setNovoValor(
                typeof valor === "number"
                  ? Number(e.target.value)
                  : e.target.value
              )
            }
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
        )}

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}
        >
          <button onClick={onClose} style={cancelButtonStyle}>
            Cancelar
          </button>
          <button
            onClick={() => onSalvar(campo, novoValor)}
            style={saveButtonStyle}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// Estilos do modal
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "1.5rem",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "400px",
};

const cancelButtonStyle: React.CSSProperties = {
  backgroundColor: "#ccc",
  border: "none",
  padding: "0.5rem 1rem",
  cursor: "pointer",
};

const saveButtonStyle: React.CSSProperties = {
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  padding: "0.5rem 1rem",
  cursor: "pointer",
};
