import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ModalEdicao from "../components/ModalPerfil";

export default function Perfil() {
  const { usuario, setUsuario } = useAuth();
  const [campoSelecionado, setCampoSelecionado] = useState<string | null>(null);

  if (!usuario) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Carregando perfil ou usuário não autenticado.</p>
      </div>
    );
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
    <div className={styles.infoItem}> {/* Usando className */}
      <span className={styles.label}>{label}:</span> {/* Usando className */}
      <span className={styles.value}>{obterValorAtual(campo)}</span> {/* Usando className */}
      <button onClick={() => abrirModal(campo)} className={styles.editIcon}> {/* Usando className */}
        ✏️
      </button>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h2 className={styles.title}>Meu Perfil</h2>

        <div className={styles.infoGroup}>
          {renderItem("Nome Completo", "nome")}
          {renderItem("Sobrenome", "sobrenome")}
          {renderItem("Email", "email")}
          {renderItem("CPF", "cpf")}
          {renderItem("Telefone", "telefone")}
          {renderItem("Gênero", "sexo")}
          {renderItem("Data de Nascimento", "dataNascimento")}
          {renderItem("Tipo de Usuário", "tipoUsuario")}
        </div>

        <h3 className={styles.sectionTitle}>Endereço</h3>
        <div className={styles.infoGroup}>
          {renderItem("CEP", "endereco.cep")}
          {renderItem("Número", "endereco.numero")}
          {renderItem("Complemento", "endereco.complemento")}
        </div>

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

const styles = {

}