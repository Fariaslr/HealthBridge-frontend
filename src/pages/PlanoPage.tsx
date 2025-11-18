import { Box, Button, CircularProgress, Divider, FormControl, FormControlLabel, Grid, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { atualizarPlano } from "../services/planoService";

export default function PlanoPage() {

  const [formData, setFormData] = useState({
    objetivo: '',
    nivelAtividadeFisica: '',
  });

  const { usuario, planoUsuario, isPlanoLoading, setPlanoUsuario } = useAuth();
  const planoExiste = !!usuario?.plano;

  const OBJETIVOS_MAP = {
    EMAGRECIMENTO: "Perder Peso",
    MANUTENCAO: "Manter Peso",
    HIPERTROFIA: "Ganho de Massa",
  };

  const NIVEIS_ATIVIDADE_MAP = {
    SEDENTARIO: "Sedentário",
    LEVEMENTE_ATIVO: "Levemente Ativo",
    MODERADAMENTE_ATIVO: "Moderadamente Ativo",
    ALTAMENTE_ATIVO: "Altamente Ativo",
    EXTREMAMENTE_ATIVO: "Extremamente Ativo",
  };

  if (isPlanoLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <CircularProgress />
        <p>Carregando plano...</p>
      </div>
    );
  }

  useEffect(() => {
    if (planoUsuario) {
      setFormData({
        objetivo: planoUsuario.objetivo || '',
        nivelAtividadeFisica: planoUsuario.nivelAtividadeFisica || '',
      });
    }
  }, [planoUsuario]);


const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
};

  const handleSave = async () => {
    if (!planoUsuario || !planoUsuario.id) return;

    const updateDto = {
      objetivo: formData.objetivo,
      nivelAtividadeFisica: formData.nivelAtividadeFisica,
    };

    try {
      const planoAtualizado = await atualizarPlano(planoUsuario.id, updateDto);
      setPlanoUsuario(planoAtualizado);
      alert("Plano atualizado com sucesso!");

    } catch (error) {
      console.error("Falha ao salvar o plano:", error);
      alert("Erro ao salvar o plano. Verifique os dados.");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Configuração do Plano
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>1. Objetivo Principal</Typography>
          <Divider sx={{ mb: 2 }} />
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              name="objetivo"
              value={formData.objetivo}
              onChange={handleChange}
            >
              {Object.entries(OBJETIVOS_MAP).map(([key, label]) => (
                <FormControlLabel
                  key={key}
                  value={key}
                  control={<Radio color="primary" />}
                  label={label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mb: 1, mt: 3 }}>2. Nível de Atividade Física</Typography>
          <Divider sx={{ mb: 2 }} />
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              name="nivelAtividadeFisica"
              value={formData.nivelAtividadeFisica}
              onChange={handleChange}
            >
              {Object.entries(NIVEIS_ATIVIDADE_MAP).map(([key, label]) => (
                <FormControlLabel
                  key={key}
                  value={key}
                  control={<Radio color="primary" />}
                  label={label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!formData.objetivo || !formData.nivelAtividadeFisica}
        >
          Salvar Configurações
        </Button>
      </Box>
    </Paper>

  );
}