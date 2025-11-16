import { Box, Card, CardContent, Grid, Typography, Divider, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useState } from 'react';
import { PerfilModalForm } from "../components/modal/ModalPerfil";
import PlanoPage from "./PlanoPage";
import { atualizarPessoa, type PessoaUpdateDto } from "../services/pessoaService";
import FormField from "../components/RenderField";

export default function PerfilPage() {
    const { usuario, isAuthReady, setUsuario } = useAuth();
    const [openModal, setOpenModal] = useState(false);

    const [form, setForm] = useState({
        cpf: usuario?.cpf ?? "",
        nome: usuario?.nome ?? "",
        sobrenome: usuario?.sobrenome ?? "",
        dataNascimento: usuario?.dataNascimento ?? "",
        sexo: usuario?.sexo ?? "",
        email: usuario?.email ?? "",
        telefone: usuario?.telefone ?? "",
        cref: (usuario as any)?.cref ?? "",
        crn: (usuario as any)?.crn ?? ""
    });

    const SEXO_OPTIONS = [
        { value: 'MASCULINO', label: 'Masculino' },
        { value: 'FEMININO', label: 'Feminino' },
        { value: 'NAO_INFORMADO', label: 'Não Informado' },
        { value: 'OUTRO', label: 'Outro' },
    ];

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        console.log("Salvar dados:", form);
        if (!usuario || !usuario.id) return;

        const updatePayload: PessoaUpdateDto = {
            ...form,
        } as PessoaUpdateDto;

        try {
            const usuarioAtualizado = await atualizarPessoa(usuario.id, updatePayload);

            setUsuario(usuarioAtualizado);
            alert("Atualização realizada com sucesso");

        } catch (error) {
            alert("Falha ao atualizar perfil: " + error);
        }
    };

    if (!isAuthReady) return <p>Carregando...</p>;
    if (!usuario) return <p>Usuário não encontrado.</p>;

    return (
        <Grid container spacing={1}>
            <Grid size={{ xs: 12 }}>
                <Card>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h5">
                                Dados Pessoais
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <FormField<typeof form>
                            title="CPF"
                            value={form.cpf}
                            field="cpf"
                            onChange={handleChange}
                        />

                        <FormField<typeof form>
                            title="Nome"
                            value={form.nome}
                            field="nome"
                            onChange={handleChange}
                        />

                        <FormField<typeof form>
                            title="Sobrenome"
                            value={form.sobrenome}
                            field="sobrenome"
                            onChange={handleChange}
                        />

                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                            <InputLabel id="sexo-label">Sexo</InputLabel>

                            <Select
                                labelId="sexo-label"
                                label="Sexo"
                                name="sexo"
                                value={form.sexo || ''}

                                onChange={(e) =>
                                    handleChange("sexo", e.target.value)
                                }
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

                        <FormField<typeof form>
                            title="Data de nascimento"
                            value={form.dataNascimento}
                            field="dataNascimento"
                            type="date"
                            onChange={handleChange}
                        />

                        <FormField<typeof form>
                            title="Email"
                            value={form.email}
                            field="email"
                            type="email"
                            onChange={handleChange}
                        />

                        <FormField<typeof form>
                            title="Telefone"
                            value={form.telefone}
                            field="telefone"
                            onChange={handleChange}
                        />

                        {usuario.tipoUsuario === "EducadorFisico" && (
                            <FormField<typeof form>
                                title="CREF / Registro"
                                value={form.cref}
                                field="cref"
                                onChange={handleChange}
                            />
                        )}

                        {usuario.tipoUsuario === "Nutricionista" && (
                            <FormField<typeof form>
                                title="CRN / Registro"
                                value={form.crn}
                                field="crn"
                                onChange={handleChange}
                            />
                        )}

                        <Box textAlign="center" mt={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                            >
                                Salvar Alterações
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <PlanoPage />

            <PerfilModalForm
                open={openModal}
                onClose={() => setOpenModal(false)}
                usuario={usuario}
            />
        </Grid>
    );
}
