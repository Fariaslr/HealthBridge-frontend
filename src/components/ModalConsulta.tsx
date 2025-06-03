// src/components/ModalConsulta.tsx
import React, { useState, useEffect, type FormEvent } from 'react'; // 'type' para FormEvent está correto
import styles from './ModalConsulta.module.css'; // Importa o CSS Module para estilização

// Interface para os dados do formulário
// Adicione 'id?' para o caso de edição
export interface ConsultaFormData {
  id?: string; // Opcional, será usado para edição
  planoId: string; // ID do Paciente
  profissionalSaudeId: string;
  dataConsulta: string; // Formato datetime-local
  peso: string;
  altura: string;
  numeroRefeicoes: string;
  torax?: string;
  abdomen?: string;
  cintura?: string;
  quadril?: string;
  bracoEsquerdo?: string;
  bracoDireito?: string;
  antibracoEsquerdo?: string;
  antibracoDireito?: string;
  coxaEsquerda?: string;
  coxaDireita?: string;
  panturrilhaEsquerda?: string;
  panturrilhaDireita?: string;
  pescoco?: string;
  observacoes?: string; // Observações adicionais
}

// Props do componente ModalConsulta
interface ModalConsultaProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ConsultaFormData) => Promise<void>; // Esta é para CREATE/EDIT
  isLoading?: boolean;
  apiError?: string | null;
  mode: 'create' | 'edit' | 'view'; // Novo: modo de operação
  initialData?: ConsultaFormData; // Novo: dados para preencher o formulário em 'edit' ou 'view'
  onEditModeRequest?: (data: ConsultaFormData) => void; // NOVO PROP: para sinalizar ao pai que quer mudar para modo de edição
}

const ModalConsulta: React.FC<ModalConsultaProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  apiError = null,
  mode,
  initialData,
  onEditModeRequest, // Desestruturar o novo prop
}) => {
  // Estado inicial do formulário baseado no initialData e mode
  const initialState: ConsultaFormData = {
    id: initialData?.id || '',
    planoId: initialData?.planoId || '',
    profissionalSaudeId: initialData?.profissionalSaudeId || '',
    dataConsulta: initialData?.dataConsulta || '',
    peso: initialData?.peso || '',
    altura: initialData?.altura || '',
    numeroRefeicoes: initialData?.numeroRefeicoes || '',
    torax: initialData?.torax || '', abdomen: initialData?.abdomen || '', cintura: initialData?.cintura || '', quadril: initialData?.quadril || '',
    bracoEsquerdo: initialData?.bracoEsquerdo || '', bracoDireito: initialData?.bracoDireito || '', antibracoEsquerdo: initialData?.antibracoEsquerdo || '', antibracoDireito: initialData?.antibracoDireito || '',
    coxaEsquerda: initialData?.coxaEsquerda || '', coxaDireita: initialData?.coxaDireita || '', panturrilhaEsquerda: initialData?.panturrilhaEsquerda || '', panturrilhaDireita: initialData?.panturrilhaDireita || '',
    pescoco: initialData?.pescoco || '',
    observacoes: initialData?.observacoes || '',
  };

  const [formData, setFormData] = useState<ConsultaFormData>(initialState);
  const [formValidationErrors, setFormValidationErrors] = useState<string | null>(null);

  // Efeito para resetar/pré-popular dados ao abrir ou mudar initialData/mode
  useEffect(() => {
    if (isOpen) {
      setFormData(initialState); // Redefine o formData com base no initialState (que usa initialData)
      setFormValidationErrors(null); // Limpar erros de validação ao abrir
    }
    // A dependência 'initialState' é uma preocupação aqui. Como 'initialState' é um objeto recriado a cada render,
    // ele fará o useEffect rodar sempre. O ideal é usar 'initialData' diretamente ou memoizar 'initialState'.
    // Para simplificar, vou usar 'initialData' e 'mode' como deps principais.
  }, [isOpen, initialData, mode]);


  // Handler para atualizar o estado do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler para a submissão do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormValidationErrors(null);

    // Validação de campos obrigatórios (apenas se não for modo 'view')
    if (mode !== 'view') {
        if (!formData.planoId || !formData.profissionalSaudeId || !formData.dataConsulta ||
            !formData.peso || !formData.altura || !formData.numeroRefeicoes) {
          setFormValidationErrors('Por favor, preencha todos os campos obrigatórios.');
          return;
        }

        const parsedDate = new Date(formData.dataConsulta);
        if (isNaN(parsedDate.getTime())) {
          setFormValidationErrors('Formato de data e hora inválido.');
          return;
        }
    }

    try {
      // Chama onSubmit APENAS para criação ou edição.
      // O botão "Editar" no modo 'view' NÃO chama handleSubmit diretamente.
      await onSubmit(formData);
    } catch (error: any) {
      // Erro da API será propagado para o pai e exibido via 'apiError' prop.
      // Aqui apenas logamos para depuração.
      console.error("Erro na submissão do formulário (interno):", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  // Lógica para desabilitar campos com base no modo
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  // Definição dos campos de medidas para renderização mais fácil
  const camposMedidas = [
    { label: 'Tórax (cm)', name: 'torax', value: formData.torax },
    { label: 'Abdômen (cm)', name: 'abdomen', value: formData.abdomen },
    { label: 'Cintura (cm)', name: 'cintura', value: formData.cintura },
    { label: 'Quadril (cm)', name: 'quadril', value: formData.quadril },
    { label: 'Braço Esquerdo (cm)', name: 'bracoEsquerdo', value: formData.bracoEsquerdo },
    { label: 'Braço Direito (cm)', name: 'bracoDireito', value: formData.bracoDireito },
    { label: 'Antebraço Esquerdo (cm)', name: 'antibracoEsquerdo', value: formData.antibracoEsquerdo },
    { label: 'Antebraço Direito (cm)', name: 'antibracoDireito', value: formData.antibracoDireito },
    { label: 'Coxa Esquerda (cm)', name: 'coxaEsquerda', value: formData.coxaEsquerda },
    { label: 'Coxa Direita (cm)', name: 'coxaDireita', value: formData.coxaDireita },
    { label: 'Panturrilha Esquerda (cm)', name: 'panturrilhaEsquerda', value: formData.panturrilhaEsquerda },
    { label: 'Panturrilha Direita (cm)', name: 'panturrilhaDireita', value: formData.panturrilhaDireita },
    { label: 'Pescoço (cm)', name: 'pescoco', value: formData.pescoco },
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isCreateMode ? 'Nova Consulta' : isEditMode ? 'Editar Consulta' : 'Detalhes da Consulta'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className={styles.closeButton}
            aria-label="Fechar modal"
          >
            &times;
          </button>
        </div>

        {(formValidationErrors || apiError) && (
          <div className={styles.errorMessage}>
            {formValidationErrors || apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Campos de ID do Paciente e Profissional */}
          <div className={styles.formGridTwoCols}>
            <div>
              <label htmlFor="planoId" className={styles.label}>
                ID do Paciente {mode !== 'view' && <span className={styles.requiredIndicator}>*</span>}
              </label>
              <input
                type="text"
                id="planoId"
                name="planoId"
                value={formData.planoId}
                onChange={handleChange}
                required={!isViewMode}
                disabled={isViewMode} // Desabilitar no modo de visualização
                className={styles.input}
                placeholder="UUID do Paciente"
              />
            </div>
            <div>
              <label htmlFor="profissionalSaudeId" className={styles.label}>
                ID do Profissional {mode !== 'view' && <span className={styles.requiredIndicator}>*</span>}
              </label>
              <input
                type="text"
                id="profissionalSaudeId"
                name="profissionalSaudeId"
                value={formData.profissionalSaudeId}
                onChange={handleChange}
                required={!isViewMode}
                disabled={isViewMode} // Desabilitar no modo de visualização
                className={styles.input}
                placeholder="UUID do Profissional"
              />
            </div>
          </div>

          {/* Campo de Data e Hora da Consulta */}
          <div>
            <label htmlFor="dataConsulta" className={styles.label}>
              Data e Hora da Consulta {mode !== 'view' && <span className={styles.requiredIndicator}>*</span>}
            </label>
            <input
              type="datetime-local"
              id="dataConsulta"
              name="dataConsulta"
              value={formData.dataConsulta}
              onChange={handleChange}
              required={!isViewMode}
              disabled={isViewMode} // Desabilitar no modo de visualização
              className={styles.input}
            />
          </div>

          {/* Campos de Peso, Altura, Refeições */}
          <div className={styles.formGridThreeCols}>
            <div>
              <label htmlFor="peso" className={styles.label}>
                Peso (kg) {mode !== 'view' && <span className={styles.requiredIndicator}>*</span>}
              </label>
              <input
                type="number"
                id="peso"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                required={!isViewMode}
                disabled={isViewMode}
                step="0.01"
                min="0"
                className={styles.input}
                placeholder="Ex: 70.5"
              />
            </div>
            <div>
              <label htmlFor="altura" className={styles.label}>
                Altura (cm) {mode !== 'view' && <span className={styles.requiredIndicator}>*</span>}
              </label>
              <input
                type="number"
                id="altura"
                name="altura"
                value={formData.altura}
                onChange={handleChange}
                required={!isViewMode}
                disabled={isViewMode}
                step="0.1"
                min="0"
                className={styles.input}
                placeholder="Ex: 175"
              />
            </div>
            <div>
              <label htmlFor="numeroRefeicoes" className={styles.label}>
                Nº de Refeições {mode !== 'view' && <span className={styles.requiredIndicator}>*</span>}
              </label>
              <input
                type="number"
                id="numeroRefeicoes"
                name="numeroRefeicoes"
                value={formData.numeroRefeicoes}
                onChange={handleChange}
                required={!isViewMode}
                disabled={isViewMode}
                step="1"
                min="1"
                className={styles.input}
                placeholder="Ex: 5"
              />
            </div>
          </div>

          {/* Seção de Medidas Corporais */}
          <h3 className={styles.sectionTitle}>Medidas Corporais (Opcional)</h3>
          <div className={styles.formGridMeasures}>
            {camposMedidas.map(campo => (
              <div key={campo.name}>
                <label htmlFor={campo.name} className={styles.label}>
                  {campo.label}
                </label>
                <input
                  type="number"
                  id={campo.name}
                  name={campo.name}
                  value={campo.value}
                  onChange={handleChange}
                  disabled={isViewMode}
                  step="0.1"
                  min="0"
                  className={styles.input}
                  placeholder="Opcional"
                />
              </div>
            ))}
          </div>

          {/* Campo de Observações Adicionais */}
          <div>
            <label htmlFor="observacoes" className={styles.label}>
              Observações Adicionais:
            </label>
            <textarea
              id="observacoes"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              disabled={isViewMode} // Desabilitar no modo de visualização
              className={styles.textarea}
              rows={3}
              placeholder="Outras observações relevantes sobre a consulta..."
            ></textarea>
          </div>

          {/* Botões de Ação do formulário */}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose} // Fecha o modal
              disabled={isLoading}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              Cancelar
            </button>
            {/* Só mostra o botão de submissão se não for modo 'view' */}
            {mode !== 'view' && (
              <button
                type="submit" // Este botão submete o formulário e chama handleSubmit
                disabled={isLoading}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                {isLoading ? (isCreateMode ? 'Criando...' : 'Salvando...') : (isCreateMode ? 'Criar Consulta' : 'Salvar Alterações')}
              </button>
            )}
            {isViewMode && ( // Adiciona um botão de edição no modo de visualização
              <button
                type="button"
                onClick={() => onEditModeRequest && onEditModeRequest(formData)} // CHAMA O NOVO PROP AQUI
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                Editar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalConsulta;