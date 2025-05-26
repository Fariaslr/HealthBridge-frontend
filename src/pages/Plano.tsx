import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Plano } from "../models/Plano";
import { buscarPlanoPorPacienteId, criarPlano } from "../services/planoService";
import { Modal } from "../components/ModalPlano";

export default function PlanoPage() {
  const { usuario } = useAuth();
  const [plano, setPlano] = useState<Plano | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [novoPlano, setNovoPlano] = useState({
    objetivo: "",
    nivelAtividadeFisica: "",
  });
  const [criando, setCriando] = useState(false);

  useEffect(() => {
    async function carregarPlano() {
      if (!usuario?.id) {
        setLoading(false);
        return;
      }
      try {
        const planoData = await buscarPlanoPorPacienteId(usuario.id);
        setPlano(planoData);
      } catch (error) {
        console.error("Erro ao carregar plano:", error);
        setPlano(null);
      } finally {
        setLoading(false);
      }
    }

    carregarPlano();
  }, [usuario]);

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNovoPlano(prev => ({ ...prev, [name]: value }));
  };

  const handleCriarPlano = async () => {
    if (!usuario) return alert("Usuário não autenticado");

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

      setPlano(planoCriado);
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

  if (loading) return <p>Carregando plano...</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      {plano ? (
        <>
          <h2>Plano de {plano.paciente.nome}</h2>
          <p><strong>Objetivo:</strong> {plano.objetivo}</p>
          <p><strong>Nível de Atividade Física:</strong> {plano.nivelAtividadeFisica}</p>
          <p><strong>Profissional:</strong> {plano.profissionalSaude.nome}</p>
          <p><strong>Data do Plano:</strong> {new Date(plano.dataPlano).toLocaleDateString()}</p>
        </>
      ) : (
        <>
          <p>Nenhum plano encontrado para o usuário.</p>
          <button onClick={abrirModal}>Criar Novo Plano</button>
        </>
      )}

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