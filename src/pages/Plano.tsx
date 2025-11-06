import { Button, CircularProgress } from "@mui/material";
import type { Plano } from "../models/Plano";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { PlanoModalForm } from "../components/ModalPlano";

export default function Plano() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { planoUsuario, isPlanoLoading } = useAuth();
  const planoExiste = !!planoUsuario;

  if (isPlanoLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <CircularProgress />
        <p>Carregando plano...</p>
      </div>
    );
  }

  return (
    <div>
      {planoExiste ? (
        <>
          <p><b>Objetivo:</b> {planoUsuario.objetivo || 'Não definido'}</p>
          <p><b>Nível de Atividade física:</b> {planoUsuario.nivelAtividadeFisica || 'Não definido'} </p>
          <p><b>Profissional Responsável:</b> {planoUsuario.profissionalSaude.nome || 'Não atribuído'} </p>
          <p><b>Última alteração:</b> {new Date(planoUsuario.dataAtualizacao).toLocaleDateString()} </p>

          <div style={{ marginTop: '20px' }}>
            <Button variant="contained" color="primary">Editar Plano</Button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <p>Parece que você ainda não possui um plano cadastrado.</p>

          <Button variant="contained" color="primary" onClick={handleOpen}>Cadastrar Plano</Button>
        </div>
      )}

      <PlanoModalForm
        open={open}
        onClose={handleClose}
        plano={planoExiste ? planoUsuario : null} 
      />
    </div>

  );
}