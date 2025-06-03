import React, { useState, useEffect, type FormEvent } from 'react';
// Adicione a palavra-chave 'type' antes de FormEvent
import styles from './ConsultaForm.module.css'; // Novo CSS Module para o formulário

export interface ConsultaFormData {
  id?: string; // Para edição
  planoId: string;
  profissionalSaudeId: string;
  peso: string;
  altura: string;
}

interface ConsultaFormProps {
  initialData?: ConsultaFormData; // Dados iniciais para preencher o formulário
  mode: 'create' | 'edit' | 'view'; // Modo do formulário
  isLoading?: boolean; // Se a submissão está em progresso
  apiError?: string | null; // Erro da API para exibição
  onCancel: () => void; // Para o botão Cancelar
  onFormSubmit: (data: ConsultaFormData) => Promise<void>; 
  onEditRequest?: (data: ConsultaFormData) => void;
}

const ConsultaForm: React.FC<ConsultaFormProps> = ({
  initialData,
  mode,
  isLoading = false,
  apiError = null,
  onCancel,
  onFormSubmit,
  onEditRequest,
}) => {
  const initialState: ConsultaFormData = {
    id: initialData?.id || '',
    planoId: initialData?.planoId || '',
    profissionalSaudeId: initialData?.profissionalSaudeId || '',
    peso: initialData?.peso || '',
    altura: initialData?.altura || '',
  };

  const [formData, setFormData] = useState<ConsultaFormData>(initialState);
  const [formValidationErrors, setFormValidationErrors] = useState<string | null>(null);
  useEffect(() => {
    setFormData(initialState);
    setFormValidationErrors(null);
  }, [initialData, mode]); // Recria o estado se initialData ou mode mudar

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormValidationErrors(null);

    if (mode !== 'view') {
        if (!formData.planoId || !formData.profissionalSaudeId || !formData.dataConsulta ||
            !formData.peso || !formData.altura || !formData.numeroRefeicoes) {
          setFormValidationErrors('Por favor, preencha todos os campos obrigatórios.');
          return;
        }

        const parsedDate = new Date(formData.dataConsulta);
        if (isNaN(parsedDate.getTime())) {
          setFormValidationErrors('Formato de data e hora inválido.');
          console.log('ConsultaForm - formData.dataConsulta antes de onSubmit:', formData.dataConsulta);
          return;
        }
    }

    try {
      await onFormSubmit(formData); // Chama a função de submissão do pai
    } catch (error: any) {
      // Erro já será propagado e exibido via 'apiError' prop
      console.error("Erro na submissão do formulário (interno):", error);
    }
  };

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

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
    <form onSubmit={handleSubmit} className={styles.form}>
      {(formValidationErrors || apiError) && (
        <div className={styles.errorMessage}>
          {formValidationErrors || apiError}
        </div>
      )}

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
            disabled={isViewMode}
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
            disabled={isViewMode}
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
          disabled={isViewMode}
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
          disabled={isViewMode}
          className={styles.textarea}
          rows={3}
          placeholder="Outras observações relevantes sobre a consulta..."
        ></textarea>
      </div>

      {/* Botões de Ação do formulário */}
      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={onCancel} // Chama o onCancel passado via props
          disabled={isLoading}
          className={`${styles.button} ${styles.buttonSecondary}`}
        >
          Cancelar
        </button>
        {mode !== 'view' && ( // Só mostra o botão de submissão se não for modo 'view'
          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            {isLoading ? (isCreateMode ? 'Criando...' : 'Salvando...') : (isCreateMode ? 'Criar Consulta' : 'Salvar Alterações')}
          </button>
        )}
        {isViewMode && ( // Adiciona um botão de edição no modo de visualização
          <button
            type="button"
            onClick={() => { /* Lógica para mudar para o modo de edição no pai */ }} // Apenas um placeholder, o pai vai lidar com isso
            className={`${styles.button} ${styles.buttonPrimary}`} // Pode ser uma cor diferente, ex: styles.buttonEdit
          >
            Editar
          </button>
        )}
      </div>
    </form>
  );
};

export default ConsultaForm;