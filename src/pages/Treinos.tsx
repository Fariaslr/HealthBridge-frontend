import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Button, Card, CardContent, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

// Definindo o tipo do treino
type Exercício = {
  nome: string;
  series: number;
};

type Treino = {
  data: string;
  hora: string;
  titulo: string;
  tipo: string;
  exercicios: Exercício[];
  notas?: string;
};

export default function Treinos() {
  const [treinoSelecionado, setTreinoSelecionado] = useState<Treino | null>(null);

  const treinos: Treino[] = [
    {
      data: "7 Maio",
      hora: "9:00",
      titulo: "Treino A",
      tipo: "Força",
      exercicios: [
        { nome: "Agachamento", series: 3 },
        { nome: "Supino reto", series: 3 },
        { nome: "Remada curvada", series: 3 },
      ],
      notas: "Aumentar a carga em 5 kg",
    },
    {
      data: "2 Maio",
      hora: "10:00",
      titulo: "Treino B",
      tipo: "Cardio",
      exercicios: [],
      notas: "",
    },
    {
      data: "25 Abril",
      hora: "08:00",
      titulo: "Treino C",
      tipo: "Flexibilidade",
      exercicios: [],
      notas: "",
    },
  ];

  return (
    <Grid container spacing={3}>
      {/* Coluna da Tabela */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Typography variant="h5" mb={2}>
          Treinos
        </Typography>
        <Button variant="contained" sx={{ mb: 2 }}>
          Novo Treino
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
              {treinos.map((c) => (
                <TableRow
                  key={c.tipo}
                  hover
                  onClick={() => setTreinoSelecionado(c)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{c.data}</TableCell>
                  <TableCell>{c.titulo}</TableCell>
                  <TableCell>
                    {c.tipo}
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
        {treinoSelecionado && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {treinoSelecionado.titulo}
              </Typography>
              <Typography>
                {treinoSelecionado.data}, {
                treinoSelecionado.hora}
              </Typography>
              <Typography>
                <strong>Exercícios:</strong> 
              </Typography>
              <Typography>
                <strong>Tipo:</strong> {treinoSelecionado.tipo}
              </Typography>
              <Typography>
                <strong>Notas:</strong> {treinoSelecionado.notas}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>

  );
}
