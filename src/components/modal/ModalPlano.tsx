import {
    Modal, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, Grid, type SelectChangeEvent,
} from "@mui/material";
import React, { useState, useEffect, type FC } from "react";
import type { Objetivo } from "../../models/Objetivo";
import type { NivelAtividadeFisica } from "../../models/NivelAtividadeFisica";
import type { Plano } from "../../models/Plano";
import { useAuth } from "../../context/AuthContext";
import { atualizarPlano, criarPlano, type PlanoRecordDto } from "../../services/planoService";


const OBJETIVOS_DISPLAY: Record<Objetivo, string> = {
    EMAGRECIMENTO: "Emagrecimento",
    MANUTENCAO: "Manutenção de Peso",
    HIPERTROFIA: "Ganho de Massa (Hipertrofia)",
};

const NIVEIS_ATIVIDADE_DISPLAY: Record<NivelAtividadeFisica, string> = {
    SEDENTARIO: "Sedentário",
    LEVEMENTE_ATIVO: "Levemente Ativo",
    MODERADAMENTE_ATIVO: "Moderadamente Ativo",
    ALTAMENTE_ATIVO: "Altamente Ativo",
    EXTREMAMENTE_ATIVO: "Extremamente Ativo",
};

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
    width: 550,
    maxHeight: '90%',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: '1px solid #ccc',
    boxShadow: 24,
    p: 4,
};

export const PlanoModalForm: FC<PlanoModalFormProps> = ({ open, onClose, plano }) => {
    const isEditing = !!plano;
    const { usuario, carregarPlanoUsuario, setPlanoUsuario } = useAuth();
    const [formData, setFormData] = useState({ objetivo: "" as Objetivo | "", nivelAtividade: "" as NivelAtividadeFisica | "" });

    useEffect(() => {
        if (plano) {
            setFormData({
                objetivo: plano.objetivo || "",
                nivelAtividade: plano.nivelAtividadeFisica || ""
            });
        } else {
            setFormData({
                objetivo: "",
                nivelAtividade: ""
            });
        }
    }, [plano]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = event.target as HTMLInputElement;
        setFormData((prev) => ({
            ...prev,
            [name as string]: value,
        }));
    };

    const handleNivelChange = (event: SelectChangeEvent<NivelAtividadeFisica>) => {
        setFormData((prev) => ({
            ...prev,
            nivelAtividade: event.target.value,
        }));
    };

    const handleSave = async () => {
        console.log("Dados do Plano a serem salvos (payload):", formData);

        if (!formData.objetivo || !formData.nivelAtividade) {
            return;
        }

        if (!usuario || !usuario.id) {
            console.error("Usuário não logado ou sem ID.");
            return;
        }

        try {
            if (isEditing) {
                if (!plano || !plano.id) {
                    throw new Error("ID do plano não encontrado para edição.");
                }
                const updateDto: Partial<PlanoRecordDto> = {
                    objetivo: formData.objetivo,
                    nivelAtividadeFisica: formData.nivelAtividade,
                };

                const planoAtualizado = await atualizarPlano(plano.id, updateDto);
                setPlanoUsuario(planoAtualizado);
                console.log("Plano Atualizado com sucesso!");

            } else {
                const pacienteId = usuario.tipoUsuario === "Paciente" ? usuario.id : "id-paciente-fixo"; 
                const createDto: PlanoRecordDto = {
                    pacienteId: pacienteId,
                    objetivo: formData.objetivo,
                    nivelAtividadeFisica: formData.nivelAtividade,
                    profissionalSaudeId: "00867429-1ecb-43c1-ae9b-e71083324498",
                };

                const planoCriado = await criarPlano(createDto);
                setPlanoUsuario(planoCriado);
                console.log("Plano Criado com sucesso!");
            }
            onClose();

        } catch (error) {
            console.error("Falha ao salvar o plano:", error);
        }
    };

    const isSaveDisabled = !formData.objetivo || !formData.nivelAtividade;

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-title" variant="h5" component="h2" mb={3}>
                    {isEditing ? "Editar Plano Existente" : "Cadastrar Novo Plano"}
                </Typography>

                <Grid container spacing={3}>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            <b>Objetivo Principal:</b>
                        </Typography>
                        <FormControl component="fieldset" fullWidth>
                            <RadioGroup
                                name="objetivo"
                                value={formData.objetivo}
                                onChange={handleChange}
                            >
                                {(Object.keys(OBJETIVOS_DISPLAY) as Objetivo[]).map((key) => (
                                    <FormControlLabel
                                        key={key}
                                        value={key}
                                        control={<Radio size="small" />}
                                        label={OBJETIVOS_DISPLAY[key]}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <FormControl fullWidth>
                            <InputLabel id="nivel-atividade-label">Nível de Atividade Física</InputLabel>
                            <Select
                                labelId="nivel-atividade-label"
                                name="nivelAtividade"
                                value={formData.nivelAtividade}
                                label="Nível de Atividade Física"
                                onChange={handleNivelChange}
                            >
                                {(Object.keys(NIVEIS_ATIVIDADE_DISPLAY) as NivelAtividadeFisica[]).map((key) => (
                                    <MenuItem key={key} value={key}>
                                        {NIVEIS_ATIVIDADE_DISPLAY[key]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        style={{ marginRight: '10px' }}
                        disabled={isSaveDisabled}
                    >
                        {isEditing ? "Atualizar Plano" : "Salvar Plano"}
                    </Button>
                    <Button variant="outlined" onClick={onClose} color="error">
                        Cancelar
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};