import {
    Modal,
    Box,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    Grid,
    type SelectChangeEvent,
} from "@mui/material";
import React, { useState, useEffect, type FC } from "react";
import type { Objetivo } from "../models/Objetivo";
import type { NivelAtividadeFisica } from "../models/NivelAtividadeFisica";
import type { Plano } from "../models/Plano";


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
    plano: Plano | null; // Plano existente para edição
}

const style = {
    // ... (Estilos, mantidos para concisão) ...
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

    // 1. ESTADO LOCAL DO FORMULÁRIO (usando os tipos importados)
    const [formData, setFormData] = useState({
        objetivo: "" as Objetivo | "", // Inicializado como vazio ou tipo Objetivo
        nivelAtividade: "" as NivelAtividadeFisica | ""
    });

    // Preencher o formulário se for EDIÇÃO
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
        // O valor aqui já é garantido pelo TypeScript como sendo um dos seus tipos!
        setFormData((prev) => ({
            ...prev,
            nivelAtividade: event.target.value,
        }));
    };

    const handleSave = () => {
        console.log("Dados do Plano a serem salvos (payload):", formData);

        // EX: Chamada à API
        // if (isEditing) {
        //    api.updatePlano(plano.id, formData);
        // } else {
        //    api.createPlano(formData);
        // }

        onClose();
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

                <Grid container spacing={3}> {/* spacing={X} no container */}

                    {/* 1. SELEÇÃO DE OBJETIVO */}
                    <Grid size={{ xs: 12, md: 8 }}> {/* Cada filho deve ter a prop 'item' */}
                        <Typography variant="subtitle1" gutterBottom>
                            Objetivo Principal:
                        </Typography>
                        <FormControl component="fieldset" fullWidth>
                            <RadioGroup
                                name="objetivo"
                                value={formData.objetivo}
                                onChange={handleChange}
                            // row // Removi 'row' para empilhar verticalmente e melhorar a leitura no modal
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

                    {/* 2. NÍVEL DE ATIVIDADE FÍSICA */}
                    <Grid size={{ xs: 12, md: 8 }}> {/* Cada filho deve ter a prop 'item' */}
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
                    {/* Fim do Grid. Agora só temos os 2 campos obrigatórios. */}
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