import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import type { Consulta } from "../models/Consulta";
import { AvaliacaoModalForm } from "../components/ModalAvaliacaoForm";
import { useAuth } from "../context/AuthContext";

export default function AvaliacaoPage() {
  const [consultaSelecionada, setConsultaSelecionada] = useState<Consulta | null>(null);
  const { carregarConsultas, consultasUsuario, isConsultasLoading } = useAuth();

  const [openAvaliacaoModal, setOpenAvaliacaoModal] = useState(false);
  const [avaliacaoParaEditar, setAvaliacaoParaEditar] = useState(null);

  const handleOpen = () => {
    setAvaliacaoParaEditar(null);
    setOpenAvaliacaoModal(true);
  };

  useEffect(() => {
    if (consultasUsuario === null) {
      carregarConsultas();
    }
  }, [consultasUsuario, carregarConsultas]);

  useEffect(() => {
    if (consultasUsuario && consultasUsuario.length > 0 && consultaSelecionada === null) {
      setConsultaSelecionada(consultasUsuario[0]);
    }
  }, [consultasUsuario, consultaSelecionada]);

  useEffect(() => {
    if (consultasUsuario === null) {
      carregarConsultas();
    }
  }, [consultasUsuario, carregarConsultas]);

  if (isConsultasLoading) {
    return <p>Carregando avaliações...</p>;
  }

  const handleClose = () => {
    setOpenAvaliacaoModal(false);
    setAvaliacaoParaEditar(null);
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Button variant="contained" sx={{ mb: 2 }} onClick={handleOpen}>
          Nova Avaliação
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Profissional</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultasUsuario?.map((c) => (
                <TableRow
                  key={c.id}
                  hover
                  onClick={() => setConsultaSelecionada(c)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{c.dataCriacao}</TableCell>
                  <TableCell>{c.profissionalSaude.nome || "Não identificado"}</TableCell>
                  <TableCell>

                  </TableCell>
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        {consultaSelecionada && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detalhes da Consulta
              </Typography>
              <Typography>
                <strong>Data e horário:</strong> {consultaSelecionada.dataAtualizacao}
              </Typography>
              <Typography>
                <strong>Profissional:</strong> {consultaSelecionada.profissionalSaude.nome}
              </Typography>
              <Typography>
                <strong>Objetivo:</strong> {consultaSelecionada.plano.objetivo}
              </Typography>
              <Typography>
                <strong>Anotações:</strong> {consultaSelecionada.observacoes}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
      <AvaliacaoModalForm
        open={openAvaliacaoModal}
        onClose={handleClose}
        avaliacao={avaliacaoParaEditar}
      />
    </Grid>
  );
}
