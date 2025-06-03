import React from 'react';
import styles from './ModalBase.module.css';

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const ModalBase: React.FC<ModalBaseProps> = ({ isOpen, onClose, title = "Detalhes", children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Fechar modal"
          >
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          {children} {/* Aqui é onde o conteúdo dinâmico (o formulário, ou detalhes) será renderizado */}
        </div>
      </div>
    </div>
  );
};

export default ModalBase;