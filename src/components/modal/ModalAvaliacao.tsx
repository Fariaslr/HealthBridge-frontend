import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    Grid,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import type { Consulta } from '../../models/Consulta';
import { useEffect, useState, type FC } from "react";
import { useAuth } from "../../context/AuthContext";
import { atualizarConsulta, criarConsulta, type ConsultaRecordDto } from "../../services/consultaService";
import { ExpandMore } from "@mui/icons-material";

const initialFormData = {
    peso: 0,
    altura: 0,
    dataConsulta: '',
    numeroRefeicoes: 0,
    torax: 0,
    abdomen: 0,
    cintura: 0,
    quadril: 0,
    bracoEsquerdo: 0,
    bracoDireito: 0,
    antibracoEsquerdo: 0,
    antibracoDireito: 0,
    coxaEsquerda: 0,
    coxaDireita: 0,
    panturrilhaEsquerda: 0,
    panturrilhaDireita: 0,
    pescoco: 0,
    observacoes: '',
};

const cleanFormData = {
    ...initialFormData
}

interface AvaliacaoModalFormProps {
    open: boolean;
    onClose: () => void;
    avaliacao: Consulta | null;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '80vh',
    maxWidth: '80vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

type AvaliacaoFormData = Omit<Consulta, 'id' | 'plano' | 'profissionalSaude'> & {
    observacoes: string;
    dataConsulta: string;
};

export const AvaliacaoModalForm: FC<AvaliacaoModalFormProps> = ({ open, onClose, avaliacao }) => {
    const isEditing = !!avaliacao;
    const title = isEditing ? 'Editar Avaliação' : 'Nova Avaliação';
    const { usuario, planoUsuario, carregarConsultas } = useAuth();

    const [formData, setFormData] = useState<AvaliacaoFormData>(initialFormData as AvaliacaoFormData);

    useEffect(() => {
        if (isEditing && avaliacao) {
            setFormData({
                ...initialFormData,
                ...avaliacao,
                observacoes: avaliacao.observacoes || '',
            });
        } else {
            setFormData(initialFormData as AvaliacaoFormData);
        }
    }, [avaliacao, isEditing]);

    const handleCloseAndClean = () => {
        setFormData(cleanFormData as AvaliacaoFormData);

        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const profissionalIdFallback = "00867429-1ecb-43c1-ae9b-e71083324498";

        if (formData.peso <= 0 || formData.altura <= 0 || !formData.dataConsulta) {
            alert("Campos obrigatórios (Peso, Altura e Data) devem ser preenchidos e positivos.");
            return;
        }

        if (!planoUsuario?.id || !usuario?.id) {
            console.error("Plano ou Usuário ID ausente. Não é possível salvar a consulta.");
            return;
        }

        let dataConsultaISO = "";
        try {
            dataConsultaISO = new Date(formData.dataConsulta).toISOString();
        } catch {
            alert("Data de consulta inválida.");
            return;
        }

        const medidasPayload = {
            ...formData,
            peso: Number(formData.peso),
            altura: Number(formData.altura),
            numeroRefeicoes: Number(formData.numeroRefeicoes),
        };

        const sanitizedPayload = Object.entries(medidasPayload).reduce(
            (acc, [key, value]) => {
                if (key === "dataConsulta") return acc;
                if (typeof value === "string" && value.trim() === "") {
                    acc[key] = null;
                } else {
                    acc[key] = value;
                }
                return acc;
            },
            {} as Record<string, any>
        );

        try {
            let finalPayload: Partial<ConsultaRecordDto>;

            // 👇 Evita erro caso o campo esteja faltando
            const profissionalSaudeId =
                planoUsuario?.profissionalSaude?.id || profissionalIdFallback;

            if (isEditing) {
                if (!avaliacao?.id) {
                    throw new Error("Avaliação inválida para edição.");
                }

                const planoIdToUse =
                    (avaliacao as any)?.plano?.id ||
                    (avaliacao as any)?.planoId ||
                    planoUsuario?.id;

                finalPayload = {
                    ...sanitizedPayload,
                    dataConsulta: dataConsultaISO,
                    planoId: planoIdToUse,
                    profissionalSaudeId,
                };

                console.log("Payload de atualização:", finalPayload);
                await atualizarConsulta(avaliacao.id, finalPayload as ConsultaRecordDto);
            } else {
                finalPayload = {
                    ...sanitizedPayload,
                    dataConsulta: dataConsultaISO,
                    planoId: planoUsuario!.id,
                    profissionalSaudeId,
                };

                console.log("Payload de criação:", finalPayload);
                await criarConsulta(finalPayload as ConsultaRecordDto);
            }

            await carregarConsultas();
            handleCloseAndClean();
        } catch (error: any) {
            console.error("Falha ao salvar a avaliação:", error.response?.data || error);
            alert("Falha ao salvar a avaliação. Verifique o console para mais detalhes.");
        }
    };


    return (
        <Modal open={open} onClose={handleCloseAndClean}>
            <Box sx={style}>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseAndClean}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h5" component="h2" mb={3}>
                    {title}
                </Typography>

                <Grid container spacing={1} size={{ xs: 12, md: 12 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Data da Consulta"
                            name="dataConsulta"
                            type="datetime-local"
                            value={formData.dataConsulta}
                            onChange={handleChange}
                            required
                            size="small"
                            slotProps={{
                                inputLabel: {
                                    shrink: true
                                }
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Peso"
                            name="peso"
                            type="number"
                            value={formData.peso === 0 ? '' : formData.peso || ''}
                            onChange={handleChange}
                            required
                            size="small"
                            inputProps={{
                                inputProps: { min: 0 }
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Altura"
                            name="altura"
                            type="number"
                            value={formData.altura === 0 ? '' : formData.altura || ''}
                            onChange={handleChange}
                            required
                            size="small"
                        />
                    </Grid>

                    <Accordion style={{ width: '100vh', marginBottom:"10px" }}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography component="span">Medidas corporais</Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{ width: '70vh', maxHeight:'40vh' ,alignItems:'center', overflow: 'auto'}}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 12 }}>
                                    <Typography variant="subtitle1">Medidas de Tronco (cm)</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        fullWidth
                                        label="Pescoço "
                                        name="pescoco"
                                        type="number"
                                        value={formData.pescoco || ''}
                                        onChange={handleChange}
                                        size="small"
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField fullWidth label="Tórax" name="torax" type="number" value={formData.torax || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField fullWidth label="Cintura" name="cintura" type="number" value={formData.cintura || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label="Abdômen" name="abdomen" type="number" value={formData.abdomen || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label="Quadril" name="quadril" type="number" value={formData.quadril || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle1">Membros Superiores (cm)</Typography>
                                </Grid>


                                <Grid size={{ xs: 6, md: 6 }}>
                                    <TextField fullWidth label="Braço Esquerdo" name="bracoEsquerdo" type="number" value={formData.bracoEsquerdo || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                                </Grid>
                                <Grid size={{ xs: 6, md: 6 }}>
                                    <TextField fullWidth label="Braço Direito" name="bracoDireito" type="number" value={formData.bracoDireito || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                                </Grid>
                                <Grid size={{ xs: 6, md: 6 }}>
                                    <TextField fullWidth label="Antebraço Esquerdo" name="antibracoEsquerdo" type="number" value={formData.antibracoEsquerdo || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                                </Grid>
                                <Grid size={{ xs: 6, md: 6 }}>
                                    <TextField fullWidth label="Antebraço Direito" name="antibracoDireito" type="number" value={formData.antibracoDireito || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle1" >Membros Inferiores (cm)</Typography>
                                </Grid>

                                {/* LINHA 7: Coxas e Panturrilhas */}
                                <Grid size={{ xs: 3, md: 3 }}>
                                    <TextField fullWidth label="Coxa (E)" name="coxaEsquerda" type="number" value={formData.coxaEsquerda || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                                </Grid>
                                <Grid size={{ xs: 3 }}>
                                    <TextField fullWidth label="Coxa (D)" name="coxaDireita" type="number" value={formData.coxaDireita || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                                </Grid>
                                <Grid size={{ xs: 3 }}>
                                    <TextField fullWidth label="Panturrilha Direita" name="panturrilhaDireita" type="number" value={formData.panturrilhaDireita || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                                </Grid>
                                <Grid size={{ xs: 3 }}>
                                    <TextField fullWidth label="Panturrilha Esquerda" name="panturrilhaEsquerda" type="number" value={formData.panturrilhaEsquerda || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>


                    {/* LINHA 8: Observações */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Observações Adicionais"
                            name="observacoes"
                            value={formData.observacoes || ''}
                            onChange={handleChange}
                            size="small"
                        />
                    </Grid>
                </Grid>

                <Box mt={4} display="flex" justifyContent="flex-end">
                    <Button onClick={handleSave} color="primary" variant="contained">
                        Salvar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};