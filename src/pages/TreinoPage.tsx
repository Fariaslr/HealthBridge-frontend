import {
  Delete,
  Edit,
  Visibility,
} from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Treino } from "../models/Treino";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

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
      <Grid size={{ xs: 12, md: 12 }}>
        <Button variant="contained" sx={{ mb: 2 }}>
          Novo Treino
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Validade</TableCell>
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
                    <TableCell>{t.nome ?? "-"}</TableCell>
                    <TableCell>{new Date(t.validadeProjeto).toLocaleString(
                    'pt-BR',
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}</TableCell>
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
    </Grid>
  );
}
