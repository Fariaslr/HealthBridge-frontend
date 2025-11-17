import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { buscarConsultaPorId } from "../services/consultaService";
import type { Consulta } from "../models/Consulta";
import { Button, Divider, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

export default function AvaliacaoDetalhePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [consulta, setConsulta] = useState<Consulta | null>(null);

    useEffect(() => {
        async function carregarConsulta() {
            if (!id) return;
            try {
                const consultaBuscada = await buscarConsultaPorId(id);
                setConsulta(consultaBuscada);
            } catch (error) {
                console.error("Erro ao carregar consulta:", error);
            }
        }

        carregarConsulta();
    }, [id]);

    if (!consulta) return <p>Carregando...</p>;

    return (
        <div>
            <IconButton
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
            >
                <ArrowBack />
            </IconButton>
            <Divider />
            <h2>Avaliação de {new Date(consulta.dataCriacao).toLocaleDateString("pt-BR")}</h2>

            <p><b>Altura:</b> {consulta.altura} cm</p>
            <p><b>Peso:</b> {consulta.peso} kg</p>
            <p><b>Calorias diárias:</b> {consulta.caloriasDiarias?.toFixed(0) + " kcal"}</p>
            <p><b>Água:</b> {consulta.aguaDiaria} ml</p>
            {consulta.plano == null
                ? (
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => navigate(`/treino/${consulta.plano.id}`)}
                    >
                        Editar Treino
                    </Button>
                )
                : (
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => navigate(`/treino/novo/${consulta.id}`)}
                    >
                        Criar Treino
                    </Button>
                )
            }


        </div>
    );
}
