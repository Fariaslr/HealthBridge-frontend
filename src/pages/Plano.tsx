import { users } from "../mock/mockPessoa";
import type { Plano } from "../models/Plano";
import type { ProfissionalSaude } from "../models/ProfissionalSaude";

export default function Plano() {
  const planoMock: Plano = {
    id: "plano1",
    paciente: users[0], // Usando o primeiro usuário do seu mockPessoa.
    objetivo: "HIPERTROFIA",
    nivelAtividadeFisica: "EXTREMAMENTE_ATIVO",
    profissionalSaude: {} as ProfissionalSaude, // Mock vazio para evitar recursão infinita
    dataCriacao: "2025-01-01T10:00:00Z",
    dataAtualizacao: "2025-01-10T11:00:00Z",
  };
  return (
    <div>
      <p><b>Objetivo:</b> {planoMock.objetivo}</p>
      <p><b>Nível de Atividade física:</b> {planoMock.nivelAtividadeFisica}</p>
      <p><b>Profissional Responsável</b> {planoMock.profissionalSaude.nome + " "+ planoMock.profissionalSaude.sobrenome}</p>
      <p><b>Última alteração:</b> {planoMock.dataAtualizacao}</p>
    </div>
  );
}
