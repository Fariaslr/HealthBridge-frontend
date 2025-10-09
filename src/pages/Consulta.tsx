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
import type { Consulta } from "../models/Consulta";
import type { ProfissionalSaude } from "../models/ProfissionalSaude";
import type { Plano } from "../models/Plano";
import { users } from "../mock/mockPessoa";
import type { Pessoa } from "../models/Pessoa";


const planoMock: Plano = {
  id: "plano1",
  paciente: users[0], // Usando o primeiro usuário do seu mockPessoa.
  objetivo: "HIPERTROFIA",
  nivelAtividadeFisica: "EXTREMAMENTE_ATIVO",
  profissionalSaude: {} as ProfissionalSaude, // Mock vazio para evitar recursão infinita
  dataCriacao: "2025-01-01T10:00:00Z",
  dataAtualizacao: "2025-01-10T11:00:00Z",
};

const profissionalSaudeMock: Pessoa = {
  id: "prof1",
  nome: "Dra. Ana Silva",
  email: "ana.silva@exemplo.com",
  cpf: "99988877766", // Add this property
  sobrenome: "Silva", // Add this property
  telefone: "11987654321", // Add this property
  usuario: "anas", // Add this property
  senha: "hashed_password_or_mock", // Add this property
  dataNascimento: "1985-05-15", // Add this property
  sexo: "FEMININO", // Add this property
  tipoUsuario: "Nutricionista", // Add this property
  endereco: {
    cep: "54321-987",
    complemento: "Sala 5",
    numero: 200,
  },
  plano: null 
};

export const consultasMock: Consulta[] = [
  
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
