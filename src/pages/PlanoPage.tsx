import { useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import { criarPlano } from "../services/planoService";
import { Modal } from "../components/ModalPlano"; 

export default function PlanoPage() {
  const { usuario, planoUsuario, carregarPlanoUsuario, isPlanoLoading, planoInexistente, isAuthReady } = useAuth(); // Importe isAuthReady também

  const [modalAberto, setModalAberto] = useState(false);
  const [novoPlano, setNovoPlano] = useState({
    objetivo: "",
    nivelAtividadeFisica: "",
  });
  const [criando, setCriando] = useState(false);

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNovoPlano((prev) => ({ ...prev, [name]: value }));
  };

  const handleCriarPlano = async () => {
    if (!usuario || !usuario.id) return alert("Usuário não autenticado");

    if (!novoPlano.objetivo || !novoPlano.nivelAtividadeFisica) {
      return alert("Preencha todos os campos");
    }

    setCriando(true);

    try {
      const planoCriado = await criarPlano({
        pacienteId: usuario.id,
        objetivo: novoPlano.objetivo,
        nivelAtividadeFisica: novoPlano.nivelAtividadeFisica,
        profissionalSaudeId: "cb660dd7-11b2-4283-a127-e939bd01f74e", // ID hardcoded do profissional
      });

      console.log("Plano criado:", planoCriado);

      // Recarrega o plano no contexto para atualizar o estado global
      await carregarPlanoUsuario();
      alert("Plano criado com sucesso!");
      setNovoPlano({ objetivo: "", nivelAtividadeFisica: "" });
      fecharModal();
    } catch (error: any) {
      console.error("Erro ao criar plano:", error);
      alert(error?.message || "Erro ao criar plano");
    } finally {
      setCriando(false);
    }
  };

  // --- Lógica de Renderização Correta e Robusta ---

  // 1. Verificação inicial da autenticação (se o AuthContext ainda está inicializando)
  if (!isAuthReady) {
    return <p>Verificando autenticação e carregando dados...</p>;
  }

  // 2. Verificação se o usuário está logado
  if (!usuario) {
    return <p>Por favor, faça login para ver seu plano.</p>;
  }

  // 3. Verificação do estado de carregamento do plano
  if (isPlanoLoading) {
    return <p>Carregando plano...</p>;
  }

  // 4. Verificação se o plano foi buscado e não encontrado
  if (planoInexistente) {
    return (
      <div style={{ padding: "2rem", fontFamily: "Arial" }}>
        <p>Nenhum plano encontrado para o usuário.</p>
        <button onClick={abrirModal}>Criar Novo Plano</button>
        {/* O modal de criação será renderizado incondicionalmente no final do componente */}
      </div>
    );
  }

  // 5. Se chegamos até aqui, o plano não está carregando, não é inexistente, e o usuário existe.
  // Então, planoUsuario DEVE conter o objeto Plano.
  // Adicione uma última verificação de segurança, embora teoricamente não seja mais necessário aqui.
  if (planoUsuario === null) {
      // Isso é um estado de erro inesperado se a lógica acima estiver perfeita.
      // Poderia indicar um problema onde o planoInexistente não foi setado corretamente,
      // ou a API retornou null e não foi pega pelo planoInexistente.
      return (
          <div style={{ padding: "2rem", fontFamily: "Arial" }}>
              <p>Ocorreu um erro ao carregar seu plano ou ele não está disponível.</p>
              <button onClick={abrirModal}>Tentar Criar Plano</button>
          </div>
      );
  }

  // Se tudo acima passou, planoUsuario é um objeto Plano válido.
  const plano = planoUsuario; // TypeScript agora sabe que 'plano' não é null aqui.

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      {/* Opcional: Adicione um 'try-catch' ou verificação para 'plano.paciente.nome' */}
      {/* Se 'plano.paciente' ou 'plano.profissionalSaude' puderem ser null no objeto 'Plano' */}
      {/* (Devido a problemas de serialização ou relações não obrigatórias no backend) */}
      <h2>Plano de {plano.paciente?.nome || 'Paciente'}</h2> {/* Use optional chaining para segurança */}
      <p><strong>Objetivo:</strong> {plano.objetivo}</p>
      <p><strong>Nível de Atividade Física:</strong> {plano.nivelAtividadeFisica}</p>
      <p><strong>Profissional:</strong> {plano.profissionalSaude?.nome || 'N/A'}</p> {/* Use optional chaining */}
      <p><strong>Criado em:</strong> {new Date(plano.dataCriacao).toLocaleDateString()} {new Date(plano.dataCriacao).toLocaleTimeString()}</p>
      <p><strong>Última Atualização:</strong> {new Date(plano.dataAtualizacao).toLocaleDateString()} {new Date(plano.dataAtualizacao).toLocaleTimeString()}</p>

      {/* O Modal de criação é renderizado aqui, fora das condicionais, e sua visibilidade é controlada por 'modalAberto' */}
      <Modal isOpen={modalAberto} onClose={fecharModal}>
        <h3>Criar novo plano</h3>
        <label>
          Objetivo:
          <select
            name="objetivo"
            value={novoPlano.objetivo}
            onChange={handleChange}
            style={{ marginLeft: 10 }}
          >
            <option value="">Selecione</option>
            <option value="EMAGRECIMENTO">Emagrecimento</option>
            <option value="MANUTENCAO">Manutenção do peso</option>
            <option value="HIPERTROFIA">Hipertrofia</option>
          </select>
        </label>
        <br />
        <label>
          Nível de Atividade Física:
          <select
            name="nivelAtividadeFisica"
            value={novoPlano.nivelAtividadeFisica}
            onChange={handleChange}
            style={{ marginLeft: 10 }}
          >
            <option value="">Selecione</option>
            <option value="SEDENTARIO">Sedentário</option>
            <option value="LEVEMENTE_ATIVO">Levemente ativo</option>
            <option value="MODERADAMENTE_ATIVO">Moderadamente ativo</option>
            <option value="ALTAMENTE_ATIVO">Altamente ativo</option>
            <option value="EXTREMAMENTE_ATIVO">Extremamente ativo</option>
          </select>
        </label>
        <br />
        <button onClick={handleCriarPlano} disabled={criando} style={{ marginTop: "1rem" }}>
          {criando ? "Criando..." : "Criar Plano"}
        </button>
      </Modal>
    </div>
  );
}