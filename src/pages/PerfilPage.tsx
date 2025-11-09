import { Box, Card, CardContent, Grid, Typography, Divider, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import React, { useState } from 'react';
import { PerfilModalForm } from "../components/modal/ModalPerfilForm";

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
            const dateOnly = dateString.split('T')[0];
            return new Date(dateOnly).toLocaleDateString('pt-BR');
        } catch (e) {
            return dateString;
        }
    };

    // Função para renderizar um campo com título e valor
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

                            {/* 🚀 BOTÃO DE EDIÇÃO */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleOpen} // Chama a função para abrir o modal
                                size="small"
                            >
                                Editar Perfil
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <Grid container>
                            <Grid size={{ xs: 12, md: 6 }}>
                                {renderField("CPF", usuario.cpf)}
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                {renderField("Nome Completo", `${usuario.nome} ${usuario.sobrenome}`)}
                            </Grid>                           
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <Grid container >
                            <Grid size={{ xs: 12, md: 4 }}>
                                {renderField("Data de Nascimento", formatDate(usuario.dataNascimento))}
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                {renderField("Sexo", usuario.sexo)}
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                {renderField("Data de Nascimento", formatDate(usuario.dataNascimento))}
                            </Grid>

                            {/* 🚀 CAMPOS ESPECÍFICOS DE PROFISSIONAL */}
                            {(usuario.tipoUsuario === 'EducadorFisico') && (
                                <Grid size={{ xs: 12, md: 12 }}>
                                    {/* Assumindo que o campo 'cref' existe em EducadorFisico */}
                                    {renderField("CREF/Registro", (usuario as any).cref || (usuario as any).crn)}
                                </Grid>
                            )}
                        </Grid>


                        <Divider sx={{ my: 3 }} />

                        {/* --- INFORMAÇÕES DE CONTATO --- */}
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
                usuario={usuario} // Passa o objeto usuário atual
            />
        </Grid>
    );
}