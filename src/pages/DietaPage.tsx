import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

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
        <Grid size={{ xs: 12, md: 12 }}> {/* <--- Corrected syntax */}
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
      </Grid>
    </div>
  );
}