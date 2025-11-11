import { Modal, Box, Typography, TextField, Button, Grid, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useEffect, type FC } from 'react';
import { useAuth, type AuthUser } from '../../context/AuthContext';
import { atualizarPessoa, type PessoaUpdateDto } from '../../services/pessoaService';

interface PerfilModalFormProps {
    open: boolean;
    onClose: () => void;
    usuario: AuthUser | null;
}

const getInitialState = (user: AuthUser | null) => ({
    nome: user?.nome || '',
    sobrenome: user?.sobrenome || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    cpf: user?.cpf || '',
    sexo: user?.sexo || '',
    dataNascimento: user?.dataNascimento ? user.dataNascimento.split('T')[0] : '',
    cref: (user as any)?.cref || '',
    crn: (user as any)?.crn || '',
    cep: (user as any)?.cep || '',
    numero: (user as any)?.numero || '',
    complemento: (user as any)?.complemento || '',
});

const SEXO_OPTIONS = [
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'FEMININO', label: 'Feminino' },
    { value: 'NAO_INFORMADO', label: 'Não Informado' },
    { value: 'OUTRO', label: 'Outro' },
];
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80vh",
    maxHeight: '75vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export const PerfilModalForm: FC<PerfilModalFormProps> = ({ open, onClose, usuario }) => {
    const { setUsuario } = useAuth();
    const [formData, setFormData] = useState(getInitialState(usuario));

    useEffect(() => {
        setFormData(getInitialState(usuario));
    }, [usuario, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!usuario || !usuario.id) return;

        const updatePayload: PessoaUpdateDto = {
            ...formData,
        } as PessoaUpdateDto;

        try {
            const usuarioAtualizado = await atualizarPessoa(usuario.id, updatePayload);

            setUsuario(usuarioAtualizado);

            onClose();

        } catch (error) {
            console.error("Falha ao atualizar perfil:", error);
        }
    };

    const handleCloseAndClean = () => {
        setFormData(getInitialState(usuario));
        onClose();
    };


    return (
        <Modal open={open} onClose={handleCloseAndClean}>
            <Box sx={style}>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseAndClean}
                    sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography variant="h5" component="h2" mb={3}>
                    Editar Perfil
                </Typography>

                <Grid container spacing={2}>

                    <Grid size={{ xs: 12, md: 12 }}>
                        <TextField fullWidth label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} size="small" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="Nome" name="nome" value={formData.nome} onChange={handleChange} size="small" required />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="Sobrenome" name="sobrenome" value={formData.sobrenome} onChange={handleChange} size="small" required />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="E-mail" name="email" value={formData.email} onChange={handleChange} size="small" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} size="small" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="Data de Nasc." name="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleChange} size="small" />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="sexo-label">Sexo</InputLabel>
                            <Select
                                labelId="sexo-label"
                                label="Sexo"
                                name="sexo"
                                value={formData.sexo || ''}

                                onChange={(e) => handleChange({
                                    target: { name: 'sexo', value: e.target.value }
                                } as React.ChangeEvent<HTMLInputElement>)}

                                size="small"
                            >
                                <MenuItem value="">
                                    <em>Selecione...</em>
                                </MenuItem>

                                {SEXO_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth label="CEP" name="cep" value={formData.cep} onChange={handleChange} size="small" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth label="Número" name="numero" value={formData.numero} onChange={handleChange} size="small" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth label="Comp." name="complemento" value={formData.complemento} onChange={handleChange} size="small" />
                    </Grid>
                    {(usuario?.tipoUsuario === 'EducadorFisico' || usuario?.tipoUsuario === 'Nutricionista') && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="CREF/CRN" name={usuario?.tipoUsuario === 'EducadorFisico' ? 'cref' : 'crn'} value={formData.cref || formData.crn} onChange={handleChange} size="small" />
                        </Grid>
                    )}
                </Grid>

                <Box mt={4} display="flex" justifyContent="flex-end">
                    <Button onClick={handleCloseAndClean} color="error" variant="outlined" sx={{ mr: 2 }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} color="primary" variant="contained">
                        Salvar Alterações
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};