import {
  Delete,
  Edit,
  Visibility,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Treino } from "../models/Treino";
import { useAuth } from "../context/AuthContext";

export default function TreinoPage() {
  const { treinosUsuario, carregarTreinos, isTreinosLoading } = useAuth();

  useEffect(() => {
    carregarTreinos();
  }, [carregarTreinos]);
  
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [treinoSelecionado, setTreinoSelecionado] = useState<Treino | null>(null);

  useEffect(() => {
    if (treinosUsuario) {
      setTreinos(treinosUsuario);
      setTreinoSelecionado(treinosUsuario[0] ?? null);
    }
  }, [treinosUsuario]);

  if (isTreinosLoading) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Coluna da Tabela */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Button variant="contained" sx={{ mb: 2 }}>
          Novo Treino
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Profissional</TableCell>
                <TableCell>Tempo</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {treinos.length > 0 ? (
                treinos.map((t) => (
                  <TableRow
                    key={t.id}
                    hover
                    onClick={() => setTreinoSelecionado(t)}
                    selected={treinoSelecionado?.id === t.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{new Date(t.dataTreino).toLocaleString(
                    'pt-BR',
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}</TableCell>
                    <TableCell>{t.consulta?.profissionalSaude?.nome ?? "-"}</TableCell>
                    <TableCell>{t.tempo ?? "-"}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary">
                        <Visibility />
                      </IconButton>
                      <IconButton color="secondary">
                        <Edit />
                      </IconButton>
                      <IconButton color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Nenhum treino encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* Coluna de Detalhes */}
      <Grid size={{ xs: 12, md: 4 }}>
        {treinoSelecionado ? (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detalhes do treino
              </Typography>
              <Typography>
                {treinoSelecionado.dataTreino}
              </Typography>

              <Typography sx={{ mt: 2 }}>
                <strong>Exercícios:</strong>
              </Typography>
              {treinoSelecionado.treinoExercicios?.length > 0 ? (
                treinoSelecionado.treinoExercicios.map((exercicio, index) => (
                  <Card key={index} variant="outlined" sx={{ my: 1, p: 1 }}>
                    <Typography variant="body2">
                      <strong>{exercicio.nomeExercicio}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Séries: {exercicio.series ?? "-"}
                    </Typography>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhum exercício cadastrado.
                </Typography>
              )}
            </CardContent>
          </Card>
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Selecione um treino para visualizar os detalhes.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
