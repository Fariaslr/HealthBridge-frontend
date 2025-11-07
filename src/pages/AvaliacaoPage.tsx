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
  IconButton,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import type { Consulta } from "../models/Consulta";
export const consultasMock: Consulta[] = [
  
];

export default function AvaliacaoPage() {
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
        <Button variant="contained" sx={{ mb: 2 }}>
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
              {consultas.map((c) => (
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
                <strong>Profissional:</strong> {consultaSelecionada.profissionalSaude.nome.concat(consultaSelecionada.profissionalSaude.sobrenome)}
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
    </Grid>
  );
}
