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
import { AvaliacaoModalForm } from "../components/modal/ModalAvaliacaoForm";
import { useAuth } from "../context/AuthContext";
import { deletarConsulta } from "../services/consultaService";

export default function AvaliacaoPage() {
  const [consultaSelecionada, setConsultaSelecionada] = useState<Consulta | null>(null);
  const { carregarConsultas, consultasUsuario, isConsultasLoading } = useAuth();

  const [openAvaliacaoModal, setOpenAvaliacaoModal] = useState(false);
  const [avaliacaoParaEditar, setAvaliacaoParaEditar] = useState<Consulta | null>(null);

  const handleOpen = () => {
    setAvaliacaoParaEditar(null);
    setOpenAvaliacaoModal(true);
  };

  const handleEdit = (consulta: Consulta) => {
    setAvaliacaoParaEditar(consulta);
    setOpenAvaliacaoModal(true);
  };

  const handleDelete = async (consultaId: string) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta avaliação? Esta ação é irreversível.");

    if (confirmar) {
      try {
        await deletarConsulta(consultaId);
        await carregarConsultas();

        if (consultaSelecionada?.id === consultaId) {
          setConsultaSelecionada(null);
        }

        console.log(`Consulta ${consultaId} excluída com sucesso.`);

      } catch (error) {
        console.error("Falha ao excluir a avaliação:", error);
        alert("Ocorreu um erro ao excluir a avaliação. Tente novamente.");
      }
    }
  }

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

  const consultasOrdenadas = consultasUsuario
    ? [...consultasUsuario].sort((a, b) => {
        const dataA = new Date(a.dataCriacao).getTime();
        const dataB = new Date(b.dataCriacao).getTime();
        
        return dataB - dataA;
    })
    : null;

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
                <TableCell>Peso</TableCell>
                <TableCell>Altura</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultasOrdenadas?.map((c) => (
                <TableRow
                  key={c.id}
                  hover
                  onClick={() => setConsultaSelecionada(c)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{new Date(c.dataCriacao).toLocaleString(
                    'pt-BR',
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }
                  )}</TableCell>
                  <TableCell>{c.peso} kg</TableCell>
                  <TableCell>{c.altura} cm</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary">
                      <Visibility />
                    </IconButton>
                    <IconButton color="secondary" onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(c);
                    }}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(c.id);
                    }}>
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
                <strong>Data e horário:</strong> {new Date(consultaSelecionada.dataCriacao).toLocaleString(
                    'pt-BR',
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    }
                  )}
              </Typography>
              <Typography>
                <strong>Profissional:</strong> {consultaSelecionada.profissionalSaude.nome}
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
