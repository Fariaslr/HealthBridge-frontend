// src/context/AuthContext.ts
import { createContext, useState, useContext, useEffect, useRef } from "react";
import type { ReactNode } from "react";
// Importe todos os tipos de Pessoa que seu contexto pode retornar
import type { Pessoa } from "../models/Pessoa";
import type { Paciente } from "../models/Paciente";
import type { ProfissionalSaude } from "../models/ProfissionalSaude";
import type { Nutricionista } from "../models/Nutricionista";
import type { EducadorFisico } from "../models/EducadorFisico";

import type { Plano } from "../models/Plano"; // Importe Plano
import { buscarPlanoPorPacienteId } from "../services/planoService";

// Definindo o tipo de usuário que o contexto pode retornar (união de tipos)
type AuthUser = Paciente | ProfissionalSaude | Pessoa | Nutricionista | EducadorFisico;

type AuthContextType = {
  usuario: AuthUser | null;
  setUsuario: (user: AuthUser | null) => void;
  planoUsuario: Plano | null;
  carregarPlanoUsuario: () => Promise<void>;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isPlanoLoading: boolean;
  planoInexistente: boolean; // <-- ESTADO NOVO E CRÍTICO PARA O LOOP
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuarioState] = useState<AuthUser | null>(null);
  const [planoUsuario, setPlanoUsuario] = useState<Plano | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isPlanoLoading, setIsPlanoLoading] = useState(false);
  const [planoInexistente, setPlanoInexistente] = useState(false); // <-- NOVO ESTADO

  const isAuthenticated = !!usuario;

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      console.log("AuthContext: Inicializando do localStorage...");
      const storedUser = localStorage.getItem("usuario");
      if (storedUser) {
        try {
          const parsedUser: AuthUser = JSON.parse(storedUser);
          setUsuarioState(parsedUser);
          console.log("AuthContext: Usuário carregado do localStorage:", parsedUser);
        } catch (e) {
          console.error("AuthContext: Erro ao parsear usuário do localStorage", e);
          localStorage.removeItem("usuario");
        }
      }
      setIsAuthReady(true);
      isInitialized.current = true;
      console.log("AuthContext: isAuthReady definido como true.");
    }
  }, []);

  const setUsuario = (user: AuthUser | null) => {
    if (user) {
      localStorage.setItem("usuario", JSON.stringify(user));
      console.log("AuthContext: Usuário definido (e salvo no localStorage):", user);
    } else {
      localStorage.removeItem("usuario");
      console.log("AuthContext: Usuário removido do localStorage.");
      setPlanoUsuario(null);
      setPlanoInexistente(false); // Reseta se não houver usuário
    }
    setUsuarioState(user);
  };

  const carregarPlanoUsuario = async () => {
    if (!usuario || usuario.tipoUsuario !== "Paciente" || !usuario.id) {
      console.log("AuthContext: Não é Paciente ou sem ID. Plano não será carregado.");
      setPlanoUsuario(null);
      setPlanoInexistente(true); // Marca como inexistente se não for paciente elegível
      return;
    }

    // <-- AQUI ESTÁ A CORREÇÃO PRINCIPAL: NÃO TENTA BUSCAR SE JÁ MARCOU COMO INEXISTENTE OU ESTÁ CARREGANDO/CARREGADO
    if (isPlanoLoading || planoUsuario || planoInexistente) {
      console.log("AuthContext: Plano já está carregando, carregado ou marcado como inexistente. Nenhuma nova tentativa.");
      return;
    }

    setIsPlanoLoading(true);
    setPlanoInexistente(false); // Reseta antes de tentar carregar
    console.log(`AuthContext: Tentando carregar plano para paciente ID: ${usuario.id}`);

    try {
      const planoData = await buscarPlanoPorPacienteId(usuario.id);
      setPlanoUsuario(planoData);
      if (!planoData) { // Se a API retornou null (ex: 404)
          setPlanoInexistente(true); // Marca que o plano não existe
      }
      console.log("AuthContext: Plano carregado com sucesso:", planoData);
    } catch (error) {
      console.error("AuthContext: Erro ao carregar plano no AuthContext:", error);
      setPlanoUsuario(null);
      setPlanoInexistente(true); // Marca que o plano não existe em caso de erro da API
    } finally {
      setIsPlanoLoading(false);
      console.log("AuthContext: Carregamento do plano finalizado.");
    }
  };

  useEffect(() => {
    console.log("AuthContext: useEffect de plano acionado. Usuario:", usuario?.id, " isAuthReady:", isAuthReady, " planoUsuario:", planoUsuario, " isPlanoLoading:", isPlanoLoading, " planoInexistente:", planoInexistente);
    // Condição: AuthContext pronto, usuário logado é Paciente, plano ainda não carregado E não está em loading E não foi marcado como inexistente
    if (isAuthReady && usuario && usuario.tipoUsuario === "Paciente" && !planoUsuario && !isPlanoLoading && !planoInexistente) {
      console.log("AuthContext: Condição para carregar plano atendida. Chamando carregarPlanoUsuario...");
      carregarPlanoUsuario();
    } else if (isAuthReady && (!usuario || usuario.tipoUsuario !== "Paciente")) {
      // Se não é Paciente ou não tem usuário, garante que planoUsuario é null e reseta planoInexistente
      if (planoUsuario !== null) {
         setPlanoUsuario(null);
         console.log("AuthContext: Plano resetado para null (não-Paciente ou sem usuário).");
      }
      if (planoInexistente !== false) {
          setPlanoInexistente(false); // Reseta este estado se o usuário não é um paciente que busca plano
      }
    }
  }, [usuario, carregarPlanoUsuario, isAuthReady, planoUsuario, isPlanoLoading, planoInexistente]);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        setUsuario,
        planoUsuario,
        carregarPlanoUsuario,
        isAuthenticated,
        isAuthReady,
        isPlanoLoading,
        planoInexistente, // <-- EXPOSTO AQUI
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};