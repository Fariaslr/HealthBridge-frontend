import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    Grid,
    IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import type { Consulta } from '../models/Consulta';
import { useEffect, useState, type FC } from "react";
import { useAuth } from "../context/AuthContext";
import { atualizarConsulta, criarConsulta, type ConsultaRecordDto } from "../services/consultaService";

const initialFormData = {
    peso: 0,
    altura: 0,
    dataCriacao: new Date().toISOString(),
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
    width: 650,
    maxHeight: '80vh',
    maxWidth: '80vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

type AvaliacaoFormData = Omit<Consulta, 'id' | 'plano' | 'profissionalSaude' | 'dataCriacao' | 'dataAtualizacao'> & {
    observacoes: string;
    dataCriacao: string;
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
            setFormData(initialFormData);
        }
    }, [avaliacao, isEditing]);

    const handleCloseAndClean = () => {
        setFormData(cleanFormData as AvaliacaoFormData);

        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name !== 'observacoes' ? (value === '' ? null : Number(value)) : value,
        }));
    };

    const handleSave = async () => {
        // 1. Validação de campos obrigatórios (Peso, Altura, Data, etc.)
        if (formData.peso <= 0 || formData.altura <= 0 || !formData.dataCriacao ) {
            console.error("Campos obrigatórios (Peso, Altura, e Data) devem ser preenchidos e positivos.");
            return;
        }
        if (!planoUsuario?.id || !usuario?.id) {
            console.error("Plano ou Usuário ID ausente. Não é possível criar a consulta.");
            return;
        }

        // 2. Criação do Payload BASE
        // Mapeamos os dados do formulário e garantimos que os números sejam passados
        const medidasPayload = {
            ...formData,
            peso: formData.peso as number,
            altura: formData.altura as number,
            numeroRefeicoes: formData.numeroRefeicoes as number,

            // Remove campos indesejados se existirem no formData, mas não no DTO
            // [Remova aqui se houver campos extras no formData que o DTO não aceita]
        };

        // 3. Montagem do DTO Final (Baseado no modo)
        let finalPayload: ConsultaRecordDto;

        // Assumindo que o profissionalSaudeId fixo é a regra:
        const profissionalId = "00867429-1ecb-43c1-ae9b-e71083324498";

        try {
            if (isEditing) {
                if (!avaliacao || !avaliacao.id) {
                    throw new Error("ID da avaliação não encontrado para edição.");
                }            
                finalPayload = {
                    ...medidasPayload, // Inclui todos os campos atualizados

                    // MANTÉM a data de criação original
                    dataCriacao: avaliacao.dataCriacao,
                    // IDs: Mantemos os IDs originais
                    planoId: avaliacao.plano.id,
                    profissionalSaudeId: avaliacao.profissionalSaude.id,
                } as ConsultaRecordDto; // Cast para forçar o DTO completo

                const consultaAtualizada = await atualizarConsulta(avaliacao.id, finalPayload);
                await carregarConsultas();
                console.log("Consulta atualizada:", consultaAtualizada);

            } else {
                finalPayload = {
                    ...medidasPayload,

                    dataCriacao: formData.dataCriacao,
                    dataAtualizacao: formData.dataCriacao, 
                    planoId: planoUsuario.id,
                    profissionalSaudeId: profissionalId,
                } as ConsultaRecordDto;

                const novaConsulta = await criarConsulta(finalPayload);
                await carregarConsultas();
                console.log("Nova consulta criada:", novaConsulta);
            }

            // 5. Fecha o modal
            handleCloseAndClean();

        } catch (error) {
            console.error("Falha ao salvar a avaliação:", error);
            // Implementar feedback de erro aqui
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
                    <Grid size={{ xs: 3, md: 3 }}>
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
                    <Grid size={{ xs: 3, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Altura"
                            name="altura"
                            type="number"
                            value={formData.altura === 0 ? '' : formData.altura || ''}
                            onChange={handleChange}
                            required
                            size="small" // ✅ CORRIGIDO
                        />
                    </Grid>
                    <Grid size={{ xs: 3, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Data da Consulta"
                            name="dataConsulta"
                            type="datetime-local" // Melhor para data e hora juntas
                            value={formData.dataCriacao}
                            onChange={handleChange}
                            required
                            size="small"
                            // Garante que o input de data/hora funciona corretamente
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={{ xs: 3, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Pescoço (Circunferência)"
                            name="pescoco"
                            type="number"
                            value={formData.pescoco || ''}
                            onChange={handleChange}
                            size="small" // ✅ CORRIGIDO
                        />
                    </Grid>

                    {/* LINHA 2: Título Tronco */}
                    <Grid size={{ xs: 12, md: 12 }}>
                        <Typography variant="subtitle1">Medidas de Tronco (cm)</Typography>
                    </Grid>

                    {/* LINHA 3: Tórax, Cintura, Abdômen, Quadril */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField fullWidth label="Tórax" name="torax" type="number" value={formData.torax || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField fullWidth label="Cintura" name="cintura" type="number" value={formData.cintura || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField fullWidth label="Abdômen" name="abdomen" type="number" value={formData.abdomen || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField fullWidth label="Quadril" name="quadril" type="number" value={formData.quadril || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                    </Grid>

                    {/* LINHA 4: Título Membros Superiores */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle1">Membros Superiores (cm)</Typography>
                    </Grid>

                    {/* LINHA 5: Braços e Antebraços */}
                    <Grid size={{ xs: 3 }}>
                        <TextField fullWidth label="Braço Direito" name="bracoDireito" type="number" value={formData.bracoDireito || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                        <TextField fullWidth label="Braço Esquerdo" name="bracoEsquerdo" type="number" value={formData.bracoEsquerdo || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                        <TextField fullWidth label="Antebraço Direito" name="antibracoDireito" type="number" value={formData.antibracoDireito || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                        <TextField fullWidth label="Antebraço Esquerdo" name="antibracoEsquerdo" type="number" value={formData.antibracoEsquerdo || ''} onChange={handleChange} size="small" /> {/* ✅ CORRIGIDO */}
                    </Grid>

                    {/* LINHA 6: Título Membros Inferiores */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle1" >Membros Inferiores (cm)</Typography>
                    </Grid>

                    {/* LINHA 7: Coxas e Panturrilhas */}
                    <Grid size={{ xs: 3 }}>
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