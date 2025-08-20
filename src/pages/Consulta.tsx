import { useState } from "react";
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
  Chip,
  IconButton,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";

interface Consulta {
  id: number;
  data: string;
  profissional: string;
  status: "Agendada" | "Concluída" | "Cancelada";
  detalhes: {
    horario: string;
    local: string;
    objetivo: string;
    anotacoes: string;
  };
}

const consultasMock: Consulta[] = [
  {
    id: 1,
    data: "10 Maio",
    profissional: "Dr. Henrique Rocha",
    status: "Agendada",
    detalhes: {
      horario: "10 Maio, 14:00",
      local: "Online",
      objetivo: "Avaliação física inicial",
      anotacoes: "Paciente deve estar de jejum",
    },
  },
  {
    id: 2,
    data: "25 Abril",
    profissional: "Clara Souza",
    status: "Concluída",
    detalhes: {
      horario: "25 Abril, 09:00",
      local: "Presencial",
      objetivo: "Retorno nutricional",
      anotacoes: "Revisão da dieta anterior",
    },
  },
  {
    id: 3,
    data: "18 Abril",
    profissional: "Dr. Henrique Rocha",
    status: "Cancelada",
    detalhes: {
      horario: "18 Abril, 15:00",
      local: "Online",
      objetivo: "Treino de reforço",
      anotacoes: "Consulta cancelada pelo paciente",
    },
  },
];

export default function Consultas() {
  const [consultas] = useState<Consulta[]>(consultasMock);
  const [consultaSelecionada, setConsultaSelecionada] = useState<Consulta | null>(
    consultas[0]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Agendada":
        return "info";
      case "Concluída":
        return "success";
      case "Cancelada":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Coluna da Tabela */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Typography variant="h5" mb={2}>
          Consultas
        </Typography>
        <Button variant="contained" sx={{ mb: 2 }}>
          Nova Consulta
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
              {consultas.map((c) => (
                <TableRow
                  key={c.id}
                  hover
                  onClick={() => setConsultaSelecionada(c)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{c.data}</TableCell>
                  <TableCell>{c.profissional}</TableCell>
                  <TableCell>
                    <Chip label={c.status} color={getStatusColor(c.status)} />
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

      {/* Coluna de Detalhes */}
      <Grid size={{ xs: 12, md: 4 }}>
        {consultaSelecionada && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detalhes da Consulta
              </Typography>
              <Typography>
                <strong>Data e horário:</strong> {consultaSelecionada.detalhes.horario}
              </Typography>
              <Typography>
                <strong>Local:</strong> {consultaSelecionada.detalhes.local}
              </Typography>
              <Typography>
                <strong>Profissional:</strong> {consultaSelecionada.profissional}
              </Typography>
              <Typography>
                <strong>Objetivo:</strong> {consultaSelecionada.detalhes.objetivo}
              </Typography>
              <Typography>
                <strong>Anotações:</strong> {consultaSelecionada.detalhes.anotacoes}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );
}
