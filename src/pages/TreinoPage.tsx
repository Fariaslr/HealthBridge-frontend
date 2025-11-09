import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Button, Card, CardContent, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { use, useState } from "react";

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
const treinosMock: Treino[] = [

];

export default function TreinoPage() {
  const [treinos, setTreinos] = useState<Treino[]>(treinosMock);
  const [treinoSelecionado, setTreinoSelecionado] = useState<Treino | null>(treinos[0]);

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
                {treinoSelecionado.exercicios.length > 0 ? (
                  treinoSelecionado.exercicios.map((exercicio, index) => (
                    <Card key={index} variant="outlined" sx={{ my: 1, p: 1 }}>
                      <Typography variant="body2">
                        <strong>{exercicio.nome}</strong>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Séries: {exercicio.series}
                      </Typography>
                    </Card>
                  ))
                ) : (
                  // Mensagem a ser exibida se não houver exercícios
                  <Typography variant="body2" color="text.secondary">
                    Nenhum exercício cadastrado.
                  </Typography>
                )}
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
