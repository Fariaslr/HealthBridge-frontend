import { useEffect, useState } from "react";
import {
  Button,
  Grid,
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
        <Grid container spacing={3}>

          {consultasOrdenadas?.map((c) => (
            <Grid
              key={c.id}
              size={{ xs: 12, md: 6, lg: 4 }}
            >
              <Paper
                elevation={3}
                style={{
                  padding: "16px",
                  cursor: "pointer",
                  borderRadius: "12px",
                }}
                onClick={() => setConsultaSelecionada(c)}
              >
                <Grid container spacing={1}>

                  <Grid size={{ xs: 12 }}>
                    <strong>Data:</strong><br />
                    {new Date(c.dataCriacao).toLocaleString("pt-BR")}
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <strong>Altura</strong>
                    <div>{c.altura} cm</div>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <strong>Peso</strong>
                    <div>{c.peso} kg</div>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <strong>Calorias</strong>
                    <div>{c.caloriasDiarias?.toFixed(0)} kcal</div>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <strong>Água</strong>
                    <div>{c.aguaDiaria} ml</div>
                  </Grid>

                  <Grid size={{ xs: 12 }} style={{ marginTop: 12 }}>
                    <Grid container justifyContent="space-between" style={{ marginTop: 8 }}>
                      <IconButton color="primary">
                        <Visibility />
                      </IconButton>
                      <IconButton color="secondary" onClick={(e) => { e.stopPropagation(); handleEdit(c); }}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}>
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>

                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>

      <AvaliacaoModalForm
        open={openAvaliacaoModal}
        onClose={handleClose}
        avaliacao={avaliacaoParaEditar}
      />
    </Grid>
  );
}
