import { Modal, Box, Typography, Button } from "@mui/material";
import React,{ type FC } from 'react';
import type { Plano } from "../models/Plano";

interface PlanoModalFormProps {
    open: boolean;
    onClose: () => void;
    plano: Plano | null; 
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  border: '1px solid #ccc',
  boxShadow: 24,
  p: 4,
};

export const PlanoModalForm: FC<PlanoModalFormProps> = ({ open, onClose, plano }) => {
    
    const isEditing = !!plano;
    const title = isEditing ? "Editar Plano Existente" : "Cadastrar Novo Plano";

    const handleSave = () => {
        console.log("Plano salvo!");
        onClose(); 
    };

    return (
        <Modal
            open={open} 
            onClose={onClose} 
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-title" variant="h6" component="h2" mb={2}>
                    {title}
                </Typography>
                
                <div id="modal-description">
                    <p> [FORMULÁRIO DE INPUTS (Objetivo, Nível, etc.) AQUI] </p>
                    {isEditing && <p>Plano ID: {plano?.id}</p>}
                </div>
                
                <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleSave} 
                        style={{ marginRight: '10px' }}
                    >
                        Salvar Plano
                    </Button>
                    <Button variant="outlined" onClick={onClose} color="error">
                        Cancelar
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};