import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ModalEdicao from "../components/ModalPerfil";
import InfoItem from "../components/InfoItem";

export default function Perfil() {
  const { usuario, setUsuario } = useAuth();
  const [campoSelecionado, setCampoSelecionado] = useState<string | null>(null);

  if (!usuario) {
    return (
      <div>
        <p >Carregando perfil ou usuário não autenticado.</p>
      </div>
    );
  }

  const obterValorAtual = (campo: string): string | number => {
    const partes = campo.split(".");
    let valor: any = usuario;

    for (const parte of partes) {
      if (valor === null || valor === undefined) return "N/A";
      valor = valor[parte];
    }

    if (campo.includes("dataNascimento") && valor) {
      try {
        return new Date(valor).toLocaleDateString('pt-BR');
      } catch (e) {
        return valor;
      }
    }
    return valor || "N/A";
  };

  const abrirModal = (campo: string) => {
    setCampoSelecionado(campo);
  };

  const fecharModal = () => {
    setCampoSelecionado(null);
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


  return (
    <div >
      <div >
        <h2>Meu Perfil</h2>
        <InfoItem
            label="Nome Completo"
            value={usuario.nome + " " + usuario.sobrenome}
            onEdit={() => abrirModal("nome")}
          />

          <InfoItem
            label="Cpf"
            value={usuario.cpf }
            onEdit={() => abrirModal("cpf")}
          />
        <h3 >Endereço</h3>
        

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
