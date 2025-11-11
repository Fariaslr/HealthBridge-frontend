import { Box, Card, CardContent, Grid, Typography, Divider, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useState } from 'react';
import { PerfilModalForm } from "../components/modal/ModalPerfil";

export default function PerfilPage() {
    const { usuario, isAuthReady } = useAuth();

    const [openModal, setOpenModal] = useState(false);

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    if (!isAuthReady) {
        return <p>Carregando dados do perfil...</p>;
    }

    if (!usuario) {
        return <p>Nenhum usuário logado. Redirecionando...</p>;
    }
    
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Não informado';
        try {
            const [year, month, day] = dateString.split('T')[0].split('-');
            return new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                timeZone: 'UTC'
            }).format(new Date(Date.UTC(+year, +month - 1, +day)));
        } catch {
            return dateString;
        }
    };

    const renderField = (title: string, value: string | number | null | undefined) => (
        <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
            <Typography variant="body1" fontWeight="medium">
                {value || 'Não informado'}
            </Typography>
        </Box>
    );

    return (
        <Grid container >
            <Grid size={{ xs: 12, md: 12 }}>
                <Card>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h5">
                                Dados Pessoais
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleOpen}
                                size="small"
                            >
                                Editar Perfil
                            </Button>
                        </Box>

                        <Divider sx={{ my: 1, mb: 1 }} />

                        <Grid container>
                            <Grid size={{ xs: 12, md: 6 }}>
                                {renderField("CPF", usuario.cpf)}
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                {renderField("Nome Completo", `${usuario.nome} ${usuario.sobrenome}`)}
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 1 }} />

                        <Grid container >
                            <Grid size={{ xs: 12, md: 6 }}>
                                {renderField("Data de Nascimento", formatDate(usuario.dataNascimento))} 
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                {renderField("Sexo", usuario.sexo)}
                            </Grid>

                            {(usuario.tipoUsuario === 'EducadorFisico') && (
                                <Grid size={{ xs: 12, md: 12 }}>
                                    {renderField("CREF/Registro", (usuario as any).cref || (usuario as any).crn)}
                                </Grid>
                            )}
                        </Grid>

                        <Divider sx={{ my: 1 }} />

                        <Grid container spacing={0}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                {renderField("E-mail", usuario.email)}
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                {renderField("Telefone", usuario.telefone)}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <PerfilModalForm
                open={openModal}
                onClose={handleClose}
                usuario={usuario}
            />
        </Grid>
    );
}