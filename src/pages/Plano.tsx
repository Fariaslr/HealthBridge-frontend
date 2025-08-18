import { useState } from "react";
import InfoItem from "../components/InfoItem";
import { useAuth } from "../context/AuthContext";

export default function Plano() {
  const { usuario, setUsuario } = useAuth();

  const [campoSelecionado, setCampoSelecionado] = useState<string | null>(null);

  const abrirModal = (campo: string) => {
    setCampoSelecionado(campo);
  };

  const fecharModal = () => {
    setCampoSelecionado(null);
  };

  if (!usuario || !usuario.plano) {
    return (
      <div >
        <p>Nenhum plano encontrado ou usuário não autenticado.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2>Plano</h2>
      <InfoItem
        label="Objetivo"
        value={plano?.objetivo}
        onEdit={() => abrirModal("nome")}
      />
    </div>
  );
};
