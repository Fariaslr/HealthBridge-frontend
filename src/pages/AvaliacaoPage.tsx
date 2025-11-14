import { useEffect, useState } from "react";
import {
  Button,
  Grid,
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
import { AvaliacaoModalForm } from "../components/modal/ModalAvaliacao";
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
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, md: 12 }}>
        <Button variant="contained" sx={{ mb: 2 }} onClick={handleOpen}>
          Nova Avaliação
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Data</TableCell>
                <TableCell align="center">Altura</TableCell>
                <TableCell align="center">Peso</TableCell>                
                <TableCell align="center">Calorias diárias</TableCell>
                <TableCell align="center">Água</TableCell>
                <TableCell align="center">Treino</TableCell>
                <TableCell align="center">Dieta</TableCell>
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
                  <TableCell align="left">{new Date(c.dataCriacao).toLocaleString(
                    'pt-BR',
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    }
                  )}</TableCell>
                  <TableCell align="center">{c.altura} cm</TableCell>
                  <TableCell align="center">{c.peso} kg</TableCell>                  
                  <TableCell align="center">{c.caloriasDiarias?.toFixed(0)} kcal</TableCell>
                  <TableCell align="center">{c.aguaDiaria} ml</TableCell>
                  <TableCell>
                    {c.treino ? (
                      <Button>
                        Ver Treino
                      </Button>
                    ) : (
                      <Button>
                        Criar Treino
                      </Button>
                    )}
                  </TableCell>

                  <TableCell>
                  </TableCell>

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

      <AvaliacaoModalForm
        open={openAvaliacaoModal}
        onClose={handleClose}
        avaliacao={avaliacaoParaEditar}
      />
    </Grid>
  );
}
