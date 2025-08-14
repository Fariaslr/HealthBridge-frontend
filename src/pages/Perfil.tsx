import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ModalEdicao from "../components/ModalPerfil";

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

  const renderItem = (label: string, campo: string) => (
    <div > 
      <span >{label}:</span> 
      <span >{" " + campo}</span> 
      <button onClick={() => abrirModal(campo)} > 
        ✏️
      </button>
    </div>
  );

  return (
    <div >
      <div >
        <h2>Meu Perfil</h2>

        <div>
          {renderItem("CPF", usuario.cpf)}
          {renderItem("Nome Completo", usuario.nome)}
          {renderItem("Sobrenome", usuario.sobrenome)}
          {renderItem("Email", usuario.email)}          
          {renderItem("Telefone", usuario.telefone)}
          {renderItem("Gênero", usuario.sexo)}
          {renderItem("Data de Nascimento", usuario.dataNascimento)}
          {renderItem("Tipo de Usuário", usuario.tipoUsuario)}
        </div>

        <h3 >Endereço</h3>
        <div >
          {renderItem("CEP", "endereco.cep")}
          {renderItem("Número", "endereco.numero")}
          {renderItem("Complemento", "endereco.complemento")}
        </div>

        {campoSelecionado && (
          <ModalEdicao
            campo={campoSelecionado}
            valor={campoSelecionado}
            onClose={fecharModal}
            onSalvar={salvarValor}
          />
        )}
      </div>
    </div>
  );
}
