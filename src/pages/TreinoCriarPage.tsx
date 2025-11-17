import { useEffect, useState } from "react";
import { Grid, Box, Card, Typography, Button, TextField, List, ListItem, Divider } from "@mui/material";
import type { ExecucaoExercicio } from "../models/ExecucaoExercicio";
import { buscarExercicios } from "../services/exercicioService";
import { useNavigate } from "react-router-dom";
import type { Exercicio } from "../models/Exercicio";


export default function TreinoCriacaoPage() {
    const [exercicios, setExercicios] = useState<Exercicio[]>([]);
    const [execucoes, setExecucoes] = useState<ExecucaoExercicio[]>([]);
    const [busca, setBusca] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function carregarExercicios() {
            const lista = await buscarExercicios();
            console.log("Exercícios carregados:", lista);
            setExercicios(lista);
        }
        carregarExercicios();
    }, []);

    function adicionarExecucao(exercicio: any) {
        setExecucoes(prev => [
            ...prev,
            {
                id: exercicio.id,
                nomeExercicio: exercicio.name,
                series: 3,
                repeticoes: 12,
                intervaloSerie: 60,
            }
        ]);
    }

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
                <Card sx={{ p: 2 }}>
                    <Typography variant="h6">Exercícios Selecionados</Typography>
                    <Divider sx={{ my: 2 }} />

                    {execucoes.length === 0 && (
                        <Typography color="text.secondary">
                            Nenhum exercício adicionado ainda.
                        </Typography>
                    )}
                    <List>
                        {execucoes.map(ex => (
                            <ListItem key={ex.id}>
                                <Box>
                                    <Typography><b>{ex.nomeExercicio}</b></Typography>
                                    <Typography variant="body2">
                                        {ex.series} séries — {ex.repeticoes} reps — {ex.intervaloSerie}s descanso
                                    </Typography>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                    <Button variant="contained" sx={{ mt: 2 }}>
                        Salvar Treino
                    </Button>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{
                    p: 2,
                    maxHeight: "85vh",
                    overflowY: "auto",
                    position: "sticky",
                    top: 20
                }}>
                    <Typography variant="h6">Lista de Exercícios</Typography>

                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Buscar exercício..."
                        sx={{ mt: 2, mb: 2 }}
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />

                    {exercicios
                        .filter(e => e.name?.toLowerCase().includes(busca.toLowerCase()))
                        .map(ex => (
                            <Card
                                key={ex.id}
                                sx={{
                                    mb: 1,
                                    p: 1,
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <Box sx={{ width: 64, height: 64, mr: 2 }}>
                                    <img
                                         src={`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${ex.id}/0.jpg`}
                                        alt={ex.name}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: 8
                                        }}
                                    />
                                </Box>

                                {/* NOME */}
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {ex.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {ex.primaryMuscles?.join(", ")}
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    sx={{ minWidth: 40, width: 40, height: 40, borderRadius: "50%" }}
                                    onClick={() => adicionarExecucao(ex)}
                                >
                                    +
                                </Button>
                            </Card>
                        ))
                    }
                </Card>
            </Grid>
        </Grid>
    );
}
