import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  LinearProgress,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const pesoData = [
  { dia: "Segunda", peso: 78 },
  { dia: "Terça", peso: 77 },
  { dia: "Quarta", peso: 75 },
  { dia: "Quinta", peso: 74 },
  { dia: "Sexta", peso: 75 },
  { dia: "Sábado", peso: 77 },
  { dia: "Domingo", peso: 78 },
];

const macrosData = [
  { name: "Proteína", value: 50 },
  { name: "Carboidratos", value: 30 },
  { name: "Gorduras", value: 20 },
];

const COLORS = ["#3b82f6", "#10b981", "#f97316"];

export default function Plano() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 6, md: 8 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            
            Próxima consulta
          </Typography>
          <Typography variant="h6">25 Maio, 10:00</Typography>
          <Typography variant="body2" color="text.secondary">
            Dr. Sandra
          </Typography>
          <Button variant="outlined" sx={{ mt: 2 }} fullWidth>
            Adicionar lembrete
          </Button>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Treino de hoje
          </Typography>
          <Typography variant="h6">Peito e tríceps</Typography>
          <Button variant="outlined" sx={{ mt: 2 }} fullWidth>
            Ver treino completo
          </Button>
        </Paper>
      </Grid>

      {/* Plano atual */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Plano atual
          </Typography>
          <Typography variant="h6">Plano Hipertrofia</Typography>
          <Typography variant="body2" color="text.secondary">
            01 Jan – 31 Dez
          </Typography>
          <Box mt={2}>
            <LinearProgress variant="determinate" value={70} />
          </Box>
          <Button variant="text" sx={{ mt: 2 }}>
            Ver detalhes
          </Button>
        </Paper>
      </Grid>

      {/* Dieta de hoje */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Dieta de hoje
          </Typography>
          <Typography variant="h6">1800 kcal</Typography>
          <Typography variant="body2" color="text.secondary">
            50% 30% 20%
          </Typography>
        </Paper>
      </Grid>

      {/* Peso */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Peso
          </Typography>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={pesoData}>
              <CartesianGrid stroke="#e5e7eb" vertical={false} />
              <Line
                type="monotone"
                dataKey="peso"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
              <XAxis dataKey="dia" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Macros */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Macros da dieta
          </Typography>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={macrosData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={50}
                label
              >
                {macrosData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <Box display="flex" justifyContent="space-around" mt={1}>
            {macrosData.map((m, i) => (
              <Typography key={i} variant="body2" sx={{ color: COLORS[i] }}>
                {m.value}% {m.name}
              </Typography>
            ))}
          </Box>
        </Paper>
      </Grid>

      {/* Última consulta */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Última consulta
          </Typography>
          <Typography variant="body2" color="primary">
            15 Maio
          </Typography>
          <Typography variant="h6">Acompanhamento nutricional</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
