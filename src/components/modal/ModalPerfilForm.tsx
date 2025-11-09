import { Modal, Box, Typography, TextField, Button, Grid, Alert } from '@mui/material';
import React, { useState, useEffect, type FC } from 'react';
import { useAuth, type AuthUser } from '../../context/AuthContext';
import { atualizarPessoa } from '../../services/pessoaService';

interface PerfilModalFormProps {
    open: boolean;
    onClose: () => void;
    usuario: AuthUser | null;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export const PerfilModalForm: FC<PerfilModalFormProps> = ({ open, onClose, usuario }) => {
    const { setUsuario } = useAuth();
    const [formData, setFormData] = useState({
        nome: '',
        sobrenome: '',
        email: '',
        telefone: '',
    });

    useEffect(() => {
        if (usuario) {
            setFormData({
                nome: usuario.nome || '',
                sobrenome: usuario.sobrenome || '',
                email: usuario.email || '',
                telefone: usuario.telefone || '',

            });
        }
    }, [usuario]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!usuario || !usuario.id) return;

        const updatePayload = {
            ...formData,
            // ⚠️ Adicione aqui a lógica para atualizar o tipo específico (Ex: ProfissionalSaude)
        };

        try {
            // 3. Chama a API
            const usuarioAtualizado = await atualizarPessoa(usuario.id, updatePayload);

            // 4. ATUALIZAÇÃO CRÍTICA: Atualiza o contexto Auth com o novo objeto
            setUsuario(usuarioAtualizado);

            <Alert severity="success">This is a success Alert.</Alert>
            alert("Perfil atualizado com sucesso:" + usuarioAtualizado);
            onClose();

        } catch (error) {
            alert("Falha ao atualizar perfil: " + error);
            // Mostrar erro
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2" mb={3}>
                    Editar Perfil
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="Nome" name="nome" value={formData.nome} onChange={handleChange} size="small" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="Sobrenome" name="sobrenome" value={formData.sobrenome} onChange={handleChange} size="small" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="E-mail" name="email" value={formData.email} onChange={handleChange} size="small" /> {/* E-mail geralmente é imutável */}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} size="small" />
                    </Grid>
                    {/* ... Adicione mais campos aqui, como dataNascimento, etc. ... */}
                </Grid>

                <Box mt={4} display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} color="error" variant="outlined" sx={{ mr: 2 }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} color="primary" variant="contained">
                        Salvar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};