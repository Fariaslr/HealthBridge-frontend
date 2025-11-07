import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Button, Card, CardContent, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";

type Refeicao = {
  nome: string;
  calorias: number;
  macros: {
    proteina: number;
    carboidratos: number;
    gorduras: number;
  };
};

type Dieta = {
  id: string;
  data: string;
  nutricionista: string;
  status: "Ativa" | "Inativa" | "Concluída";
  caloriasTotais: number;
  refeicoes: Refeicao[];
  notas?: string;
};

const dietasMock: Dieta[] = [
  
];

export default function DietaPage() {
  const [dietas, setDietas] = useState<Dieta[]>(dietasMock);
  const [dietaSelecionada, setDietaSelecionada] = useState<Dieta | null>(dietasMock[0]);

  return (
    <div>
      <Grid container spacing={3}>
        {/* Coluna da Tabela */}
        <Grid size={{ xs: 12, md: 8 }}> {/* <--- Corrected syntax */}
          <Button variant="contained" sx={{ mb: 2 }}>
            Nova Dieta
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Nutricionista</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dietas.map((dieta) => (
                  <TableRow
                    key={dieta.id}
                    hover
                    onClick={() => setDietaSelecionada(dieta)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{dieta.data}</TableCell>
                    <TableCell>{dieta.nutricionista}</TableCell>
                    <TableCell>{dieta.status}</TableCell>
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
        <Grid size={{ xs: 12, md: 4 }}> {/* <--- Corrected syntax */}
          {dietaSelecionada && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Detalhes da Dieta
                </Typography>
                <Typography>
                  <strong>Data:</strong> {dietaSelecionada.data}
                </Typography>
                <Typography>
                  <strong>Nutricionista:</strong> {dietaSelecionada.nutricionista}
                </Typography>
                <Typography>
                  <strong>Calorias Totais:</strong> {dietaSelecionada.caloriasTotais} kcal
                </Typography>
                <Typography>
                  <strong>Status:</strong> {dietaSelecionada.status}
                </Typography>
                
                <Typography variant="subtitle1" mt={2}>
                  <strong>Refeições:</strong>
                </Typography>
                {dietaSelecionada.refeicoes.length > 0 ? (
                  dietaSelecionada.refeicoes.map((refeicao, index) => (
                    <Card key={index} variant="outlined" sx={{ my: 1, p: 1 }}>
                      <Typography variant="body2">
                        <strong>{refeicao.nome}:</strong> {refeicao.calorias} kcal
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Proteína: {refeicao.macros.proteina}g | Carboidratos: {refeicao.macros.carboidratos}g | Gorduras: {refeicao.macros.gorduras}g
                      </Typography>
                    </Card>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma refeição cadastrada.
                  </Typography>
                )}
                
                <Typography variant="subtitle1" mt={2}>
                  <strong>Notas:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dietaSelecionada.notas || "Nenhuma nota adicionada."}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </div>
  );
}