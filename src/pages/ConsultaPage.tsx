import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { criarPlano } from "../services/planoService";
import { Modal } from "../components/ModalPlano"; // Presumindo que 'ModalPlano' é seu modal genérico ou específico

export default function PlanoPage() {
  const { usuario, planoUsuario, carregarPlanoUsuario, isPlanoLoading, planoInexistente } = useAuth();

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
        profissionalSaudeId: "cb660dd7-11b2-4283-a127-e939bd01f74e",
      });

      console.log("Plano criado:", planoCriado);

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

  // --- Lógica de Renderização Corrigida ---

  if (!usuario) {
    return <p>Por favor, faça login para ver seu plano.</p>;
  }

  if (isPlanoLoading) {
    return <p>Carregando plano...</p>;
  }

  // Define o conteúdo principal da página (se o plano existe ou não)
  let mainContent;
  if (planoUsuario === null && planoInexistente) {
    mainContent = (
      <>
        <p>Nenhum plano encontrado para o usuário.</p>
        {/* O botão AGORA será renderizado aqui, dentro deste bloco. */}
        {/* O Modal em si será renderizado fora deste if/else, no final do return. */}
        <button onClick={abrirModal}>Criar Novo Plano</button>
      </>
    );
  } else {
    // Se o plano existe (planoUsuario não é null), renderiza os detalhes
    const plano = planoUsuario!; // Usamos '!' pois as condições acima garantem que não é null
    mainContent = (
      <>
        <h2>Plano de {plano.paciente.nome}</h2>
        <p><strong>Objetivo:</strong> {plano.objetivo}</p>
        <p><strong>Nível de Atividade Física:</strong> {plano.nivelAtividadeFisica}</p>
        <p><strong>Profissional:</strong> {plano.profissionalSaude.nome}</p>
        <p><strong>Criado em:</strong> {new Date(plano.dataCriacao).toLocaleDateString()} {new Date(plano.dataCriacao).toLocaleTimeString()}</p>
        <p><strong>Última Atualização:</strong> {new Date(plano.dataAtualizacao).toLocaleDateString()} {new Date(plano.dataAtualizacao).toLocaleTimeString()}</p>
        {/* Você pode adicionar um botão para editar o plano aqui se necessário */}
      </>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      {mainContent} {/* Renderiza o conteúdo principal (plano ou mensagem/botão) */}

      {/* O MODAL AGORA É RENDERIZADO SEMPRE AQUI, NO FINAL DO COMPONENTE */}
      {/* Sua visibilidade é controlada pela prop 'isOpen' */}
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