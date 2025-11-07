import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { PlanoModalForm } from "../components/ModalPlano";
import { deletarPlano } from "../services/planoService";

export default function PlanoPage() {
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const { planoUsuario, isPlanoLoading, carregarPlanoUsuario, setPlanoUsuario } = useAuth();
  const profissional = planoUsuario?.profissionalSaude;
  const planoExiste = !!planoUsuario;

  if (isPlanoLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <CircularProgress />
        <p>Carregando plano...</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!planoUsuario || !planoUsuario.id) {
      console.error("ID do plano ausente para exclusão.");
      return;
    }

    try {
      await deletarPlano(planoUsuario.id);

      setPlanoUsuario(null);
      handleCloseConfirm();
      console.log(`Plano ID ${planoUsuario.id} excluído com sucesso!`);
      
    } catch (error) {
      console.error("Erro ao deletar plano:", error);
      handleCloseConfirm();
    }
  };

  return (
    <div>
      {planoExiste ? (
        <>
          <p><b>Objetivo:</b> {planoUsuario.objetivo || 'Não definido'}</p>
          <p><b>Nível de Atividade física:</b> {planoUsuario.nivelAtividadeFisica || 'Não definido'} </p>
          <p>
            <b>Profissional Responsável:</b>
            {profissional?.nome ? `${profissional.nome} ${profissional.sobrenome || ''}`.trim() : 'Não atribuído'}
          </p>
          <p>
            <b>Última alteração:</b>{" "}
            {new Date(planoUsuario.dataAtualizacao).toLocaleString(
              'pt-BR',
              {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }
            )}
          </p>

          <div style={{ marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleOpenForm}>Editar Plano</Button>
            <Button variant="contained" color="secondary" onClick={handleOpenConfirm}>Excluir</Button>
          </div>
        </>
      ) : (
        <div>
          <p>Parece que você ainda não possui um plano cadastrado.</p>
          <Button variant="contained" color="primary" onClick={handleOpenForm}>Cadastrar Plano</Button>
        </div>
      )}

      <PlanoModalForm
        open={openForm}
        onClose={handleCloseForm}
        plano={planoExiste ? planoUsuario : null}
      />

      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar Exclusão"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Tem certeza que deseja excluir permanentemente o plano atual? Esta ação é irreversível.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained" 
            autoFocus
          >
            Excluir Plano
          </Button>
        </DialogActions>
      </Dialog>
    </div>

  );
}