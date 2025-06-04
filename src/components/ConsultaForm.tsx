import React, { useState, useEffect, type FormEvent } from 'react';
import styles from './ConsultaForm.module.css';

// --- INTERFACE CORRIGIDA: planoId de volta, e types para userType/userId ---
export interface ConsultaFormData {
  id?: string;
  planoId: string; // <-- DE VOLTA: Profissionais precisam digitar o ID do plano do paciente
  profissionalSaudeId: string;
  peso: string;
  altura: string;
}

interface ConsultaFormProps {
  initialData?: ConsultaFormData;
  mode: 'create' | 'edit' | 'view';
  isLoading?: boolean;
  apiError?: string | null;
  onCancel: () => void;
  onFormSubmit: (data: ConsultaFormData) => Promise<void>;
  onEditRequest?: (data: ConsultaFormData) => void;
  // NOVOS PROPS
  userType?: "Paciente" | "Nutricionista" | "EducadorFisico" | string; // Adicione o tipo de usuário
  userId?: string; // Adicione o ID do usuário
}
// --- FIM DA INTERFACE CORRIGIDA ---


const ConsultaForm: React.FC<ConsultaFormProps> = ({
  initialData,
  mode,
  isLoading = false,
  apiError = null,
  onCancel,
  onFormSubmit,
  onEditRequest,
  userType, // <-- DESESTRUTURADO
  userId,   // <-- DESESTRUTURADO
}) => {
  // --- initialState CORRIGIDO ---
  const initialState: ConsultaFormData = {
    id: initialData?.id || '',
    planoId: initialData?.planoId || '', // <-- DE VOLTA AQUI
    profissionalSaudeId: initialData?.profissionalSaudeId || '',
    peso: initialData?.peso || '',
    altura: initialData?.altura || '',
  };
  // --- FIM DO initialState CORRIGIDO ---

  const [formData, setFormData] = useState<ConsultaFormData>(initialState);
  const [formValidationErrors, setFormValidationErrors] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      id: initialData?.id || '',
      planoId: initialData?.planoId || '', // <-- DE VOLTA AQUI
      profissionalSaudeId: initialData?.profissionalSaudeId || '',
      peso: initialData?.peso ? String(initialData.peso) : '',
      altura: initialData?.altura ? String(initialData.altura) : '',
    });
    setFormValidationErrors(null);
  }, [initialData, mode]);

  // Efeito para pré-preencher IDs baseados no userType
  useEffect(() => {
    // Pré-preencher planoId para Paciente
    if (userType === "Paciente" && userId && !formData.planoId) {
        // Assume que userId aqui é o ID do plano do paciente, ou que o ID do plano é passado de alguma forma.
        // Se o planoId do paciente vem de 'planoUsuario.id' na ConsultaPage, ele deve ser passado como initialData.planoId
        // aqui. O formData.planoId só é atualizado por input.
        // Para o paciente, o input de planoId deve ser disabled e preenchido via initialData.
        // Então, esta parte do useEffect não é necessária para o planoId do paciente.
    }
    // Pré-preencher profissionalSaudeId para ProfissionalSaude
    if ((userType === "Nutricionista" || userType === "EducadorFisico") && userId && !formData.profissionalSaudeId) {
      setFormData(prev => ({ ...prev, profissionalSaudeId: userId }));
    }
  }, [userId, userType, formData.profissionalSaudeId]); // Adicione formData.planoId se precisar de pré-preenchimento complexo

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormValidationErrors(null);

    if (mode !== 'view') {
        // Validação completa, agora com planoId de volta
        if (!formData.planoId || !formData.profissionalSaudeId || !formData.peso || !formData.altura) {
          setFormValidationErrors('Por favor, preencha todos os campos obrigatórios (ID do Paciente, ID do Profissional, Peso, Altura).');
          return;
        }
    }

    try {
      await onFormSubmit(formData);
    } catch (error: any) {
      console.error("Erro na submissão do formulário:", error);
    }
  };

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  const camposMedidas: [] = [];

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {(formValidationErrors || apiError) && (
        <div className={styles.errorMessage}>
          {formValidationErrors || apiError}
        </div>
      )}

      {/* Campo de ID do Paciente (planoId) - AGORA VISÍVEL NOVAMENTE E CONDICIONALMENTE DESABILITADO */}
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
            disabled={isViewMode || userType === "Paciente"} // Paciente não digita, seu planoId vem do contexto
            className={styles.input}
            placeholder={userType === "Paciente" ? "Seu ID de Plano" : "ID do Paciente para agendamento"}
          />
        </div>
        {/* Campo de ID do Profissional */}
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
            disabled={isViewMode || (userType === "Nutricionista" || userType === "EducadorFisico")} // Profissional não digita o próprio ID
            className={styles.input}
            placeholder={(userType === "Nutricionista" || userType === "EducadorFisico") ? "Seu ID" : "ID do Profissional"}
          />
        </div>
      </div>

      {/* Campos de Peso e Altura (permanecem) */}
      <div className={styles.formGridTwoCols}>
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
      </div>

      {/* Botões de Ação do formulário */}
      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className={`${styles.button} ${styles.buttonSecondary}`}
        >
          Cancelar
        </button>
        {mode !== 'view' && (
          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            {isLoading ? (isCreateMode ? 'Criando...' : 'Salvando...') : (isCreateMode ? 'Criar Consulta' : 'Salvar Alterações')}
          </button>
        )}
        {isViewMode && (
          <button
            type="button"
            onClick={() => onEditRequest && onEditRequest(formData)}
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            Editar
          </button>
        )}
      </div>
    </form>
  );
};

export default ConsultaForm;