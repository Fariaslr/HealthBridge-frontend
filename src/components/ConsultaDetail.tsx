import React from 'react';
import styles from './ConsultaDetail.module.css';
import type { Consulta } from '../models/Consulta';

interface ConsultaDetailProps {
  consulta: Consulta;
}

const ConsultaDetail: React.FC<ConsultaDetailProps> = ({ consulta }) => {
  if (!consulta) {
    return <p className={styles.emptyState}>Nenhum detalhe de consulta disponível.</p>;
  }
  
  return (
    <div className={styles.detailContainer}>
      <p><strong>Data e Hora:</strong> {new Date(consulta.dataCriacao).toLocaleString('pt-BR')}</p>
      <p><strong>Paciente:</strong> {consulta.plano.paciente.nome} {consulta.plano.paciente.sobrenome}</p>
      <p><strong>Profissional:</strong> {consulta.profissionalSaude.nome} {consulta.profissionalSaude.sobrenome} ({consulta.profissionalSaude.tipoUsuario})</p>
      {consulta.observacoes && (
          <div className={styles.detailSection}>
              <h4>Observações e Medidas:</h4>
              <p className={styles.detailText}>{consulta.observacoes}</p>
          </div>
      )}
      <p className={styles.auditDates}>
        Criado em: {new Date(consulta.dataCriacao).toLocaleDateString('pt-BR')} |
        Última Atualização: {new Date(consulta.dataAtualizacao).toLocaleDateString('pt-BR')}
      </p>
    </div>
  );
};

export default ConsultaDetail;