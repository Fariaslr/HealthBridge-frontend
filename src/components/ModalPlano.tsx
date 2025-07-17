// src/components/ModalPlano.tsx
import React, { useState, useEffect, type FormEvent } from "react";
import type { Plano } from "../models/Plano";
import type { PlanoRecordDto } from "../services/planoService";

interface ModalPlanoProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: Plano | null;
  onSave: (data: PlanoRecordDto) => Promise<void>;
  isLoading: boolean;
  apiError?: string | null;
  userType?: "Paciente" | "Nutricionista" | "EducadorFisico" | string;
  userId?: string;
  planoIdFromContext?: string | null;
}

export function ModalPlano({
  isOpen,
  onClose,
  mode,
  initialData,
  onSave,
  isLoading,
  apiError,
  userType,
  userId,
  planoIdFromContext,
}: ModalPlanoProps) {
  // Log para depuração - pode ser removido após a correção
  console.log("ModalPlano: Prop isOpen recebido:", isOpen); 

  const [formData, setFormData] = useState<PlanoRecordDto>({
    pacienteId: "",
    profissionalSaudeId: "",
    objetivo: "",
    nivelAtividadeFisica: "",
  });
  const [formValidationErrors, setFormValidationErrors] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setFormData({
          pacienteId: initialData.paciente?.id || "",
          profissionalSaudeId: initialData.profissionalSaude?.id || "",
          objetivo: initialData.objetivo,
          nivelAtividadeFisica: initialData.nivelAtividadeFisica,
        });
      } else if (mode === "create") {
        const defaultPacienteId = userType === "Paciente" ? (planoIdFromContext || "") : "";
        const defaultProfissionalId = (userType === "Nutricionista" || userType === "EducadorFisico") ? (userId || "") : "";

        setFormData({
          pacienteId: defaultPacienteId,
          profissionalSaudeId: defaultProfissionalId,
          objetivo: "",
          nivelAtividadeFisica: "",
        });
      }
      setFormValidationErrors(null);
    }
  }, [isOpen, mode, initialData, userType, userId, planoIdFromContext]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormValidationErrors(null);

    if (!formData.pacienteId || !formData.profissionalSaudeId || !formData.objetivo || !formData.nivelAtividadeFisica) {
      setFormValidationErrors("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await onSave(formData);
    } catch (error: any) {
      console.error("Erro na submissão do formulário do plano (ModalPlano):", error);
    }
  };

  // Log para confirmar que o modal está prestes a renderizar o JSX
  console.log("ModalPlano: Começando a renderizar conteúdo do modal.");

  const modalTitle = mode === "create" ? "Criar Novo Plano" : "Editar Plano";
  const submitButtonText = isLoading ? (mode === "create" ? "Criando..." : "Salvando...") : (mode === "create" ? "Criar Plano" : "Salvar Alterações");

  const isPacienteUsuario = userType === "Paciente";
  const isProfissionalUsuario = userType === "Nutricionista" || userType === "EducadorFisico";

  // --- Estilos Inline Dinâmicos para o Modal ---
  // O backdropStyle e modalContentStyle agora dependem de `isOpen` para controlar a visibilidade e transições
  const backdropStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // Z-index alto para ficar acima de outros elementos
    opacity: isOpen ? 1 : 0, // Controla a opacidade
    visibility: isOpen ? 'visible' : 'hidden', // Controla a visibilidade
    transition: "opacity 0.3s ease-out, visibility 0.3s ease-out", // Transição suave
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    minWidth: "350px",
    maxWidth: "500px",
    position: "relative",
    color: "#333",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transform: isOpen ? "translateY(0)" : "translateY(-20px)", // Transição de movimento
    opacity: isOpen ? 1 : 0, // Transição de opacidade para o conteúdo
    transition: "transform 0.3s ease-out, opacity 0.3s ease-out", // Transição suave
  };

  const closeBtnStyle: React.CSSProperties = {
    position: "absolute", top: "0.5rem", right: "0.5rem",
    background: "transparent", border: "none", fontSize: "1.5rem",
    cursor: "pointer", color: "#666", padding: "0.25rem",
  };

  const errorMessageStyle: React.CSSProperties = {
    backgroundColor: "#f8d7da", color: "#721c24", padding: "0.75rem",
    marginBottom: "1rem", border: "1px solid #f5c6cb", borderRadius: "4px",
  };

  const formStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column", gap: "1rem",
  };

  const labelStyle: React.CSSProperties = {
    color: "#333", marginBottom: "0.5rem", display: "block", fontWeight: "bold",
  };

  const inputStyle: React.CSSProperties = { 
    display: "block", width: "100%", padding: "0.5rem 0.75rem",
    border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "white",
    color: "#333", fontSize: "1em", marginTop: "0.25rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem",
  };

  const primaryButtonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem", fontSize: "1em", fontWeight: "bold",
    borderRadius: "4px", border: "none", backgroundColor: "#007bff",
    color: "white", cursor: "pointer", transition: "background-color 0.2s ease-in-out",
  };

  const secondaryButtonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem", fontSize: "1em", fontWeight: "bold",
    borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "#f8f9fa",
    color: "#333", cursor: "pointer", transition: "background-color 0.2s ease-in-out",
  };

  // O modal sempre será renderizado no DOM para permitir as transições
  // A visibilidade é controlada pelas propriedades de estilo dinâmicas
  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <button style={closeBtnStyle} onClick={onClose} disabled={isLoading}>
          ✖
        </button>
        <h3 style={{ color: "#333", marginBottom: "1rem" }}>{modalTitle}</h3>

        {(formValidationErrors || apiError) && (
          <div style={errorMessageStyle}>
            {formValidationErrors || apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Campo Paciente ID */}
          <label style={labelStyle}>
            ID do Paciente:
            <input
              type="text"
              name="pacienteId"
              value={formData.pacienteId}
              onChange={handleChange}
              required 
              disabled={isLoading || isPacienteUsuario} // Desabilita se for Paciente (vem do contexto)
              style={inputStyle} 
            />
          </label>
          <br />

          {/* Campo Profissional ID */}
          <label style={labelStyle}>
            ID do Profissional:
            <input
              type="text"
              name="profissionalSaudeId"
              value={formData.profissionalSaudeId}
              onChange={handleChange}
              required 
              disabled={isLoading || isProfissionalUsuario} // Desabilita se for Profissional (vem do contexto)
              style={inputStyle} 
            />
          </label>
          <br />

          <label style={labelStyle}>
            Objetivo:
            <select
              name="objetivo"
              value={formData.objetivo}
              onChange={handleChange}
              required 
              disabled={isLoading}
              style={inputStyle} // Usando inputStyle para selects também
            >
              <option value="">Selecione</option>
              <option value="EMAGRECIMENTO">Emagrecimento</option>
              <option value="MANUTENCAO">Manutenção do peso</option>
              <option value="HIPERTROFIA">Hipertrofia</option>
            </select>
          </label>
          <br />
          <label style={labelStyle}>
            Nível de Atividade Física:
            <select
              name="nivelAtividadeFisica"
              value={formData.nivelAtividadeFisica}
              onChange={handleChange}
              required 
              disabled={isLoading}
              style={inputStyle} // Usando inputStyle para selects também
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
          <div style={buttonGroupStyle}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={secondaryButtonStyle}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={primaryButtonStyle}
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}