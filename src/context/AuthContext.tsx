import {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type SetStateAction,
  type Dispatch,
} from "react";

import type { Pessoa } from "../models/Pessoa";
import type { Paciente } from "../models/Paciente";
import type { ProfissionalSaude } from "../models/ProfissionalSaude";
import type { Nutricionista } from "../models/Nutricionista";
import type { EducadorFisico } from "../models/EducadorFisico";

import type { Plano } from "../models/Plano";
import { buscarPlanoPorPacienteId } from "../services/planoService";
import type { Consulta } from "../models/Consulta";
import { buscarConsultasPorPacienteId } from "../services/consultaService";

type AuthUser =
  | Paciente
  | ProfissionalSaude
  | Pessoa
  | Nutricionista
  | EducadorFisico;

type AuthContextType = {
  usuario: AuthUser | null;
  setUsuario: (user: AuthUser | null) => void;
  planoUsuario: Plano | null;
  setPlanoUsuario: Dispatch<SetStateAction<Plano | null>>;
  carregarPlanoUsuario: () => Promise<void>;

  consultasUsuario: Consulta[] | null;
  setConsultasUsuario: Dispatch<SetStateAction<Consulta[] | null>>;
  carregarConsultas: () => Promise<void>;
  isConsultasLoading: boolean;
  
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isPlanoLoading: boolean;
  planoInexistente: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuarioState] = useState<AuthUser | null>(null);
  const [planoUsuario, setPlanoUsuario] = useState<Plano | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isPlanoLoading, setIsPlanoLoading] = useState(false);
  const [planoInexistente, setPlanoInexistente] = useState(false);

  const [consultasUsuario, setConsultasUsuario] = useState<Consulta[] | null>(null);
  const [isConsultasLoading, setIsConsultasLoading] = useState(false);

  const isAuthenticated = !!usuario;
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      const storedUser = localStorage.getItem("usuario");
      let initialUser: AuthUser | null = null;
      if (storedUser) {
        try {
          initialUser = JSON.parse(storedUser);
        } catch (e) {
          localStorage.removeItem("usuario");
        }
      }
      setUsuarioState(initialUser);
      setIsAuthReady(true);
      isInitialized.current = true;
    }
  }, []);

  const setUsuario = (user: AuthUser | null) => {
    if (user) {
      localStorage.setItem("usuario", JSON.stringify(user));
    } else {
      localStorage.removeItem("usuario");
      setPlanoUsuario(null);
      setPlanoInexistente(false);
    }
    setUsuarioState(user);
  };

  const carregarConsultas = useCallback(async () => {
    if (!usuario || usuario.tipoUsuario !== "Paciente" || !usuario.id) {
        setConsultasUsuario([]);
        return;
    }
    
    setIsConsultasLoading(true);
    
    try {
        const consultasData = await buscarConsultasPorPacienteId(usuario.id);
        setConsultasUsuario(consultasData); 
    } catch (error) {
        console.error("Erro ao carregar consultas:", error);
        setConsultasUsuario([]); // Em caso de falha, define como array vazio
    } finally {
        setIsConsultasLoading(false);
    }
  }, [usuario]);

  const carregarPlanoUsuario = useCallback(async () => {
    if (
      isPlanoLoading ||
      planoUsuario ||
      planoInexistente ||
      !usuario ||
      usuario.tipoUsuario !== "Paciente" ||
      !usuario.id
    ) {
      if (
        (planoUsuario && !planoInexistente) ||
        (planoInexistente && !planoUsuario)
      ) {
        return;
      }
      if (!usuario || usuario.tipoUsuario !== "Paciente" || !usuario.id) {
        setPlanoUsuario(null);
        setPlanoInexistente(true);
        setIsPlanoLoading(false);
        return;
      }
      if (isPlanoLoading) {
        return;
      }
    }

    setIsPlanoLoading(true);
    setPlanoInexistente(false);

    try {
      const planoData = await buscarPlanoPorPacienteId(usuario.id);
      if (planoData) {
        setPlanoUsuario(planoData);
        setPlanoInexistente(false);
      } else {
        setPlanoUsuario(null);
        setPlanoInexistente(true);
      }
    } catch (error) {
      setPlanoUsuario(null);
      setPlanoInexistente(true);
    } finally {
      setIsPlanoLoading(false);
    }
  }, [usuario, isPlanoLoading, planoUsuario, planoInexistente]);

  useEffect(() => {
    if (
      isAuthReady &&
      usuario &&
      usuario.tipoUsuario === "Paciente" &&
      !planoUsuario &&
      !isPlanoLoading &&
      !planoInexistente
    ) {
      carregarPlanoUsuario();
    } else if (
      isAuthReady &&
      (!usuario || usuario.tipoUsuario !== "Paciente")
    ) {
      if (planoUsuario !== null) setPlanoUsuario(null);
      if (planoInexistente !== false) setPlanoInexistente(false);
      if (isPlanoLoading) setIsPlanoLoading(false);
      if (isAuthReady && usuario && usuario.tipoUsuario === "Paciente" && consultasUsuario === null) {
        carregarConsultas();
    }
    }
  }, [
    isAuthReady,
    usuario,
    planoUsuario,
    isPlanoLoading,
    planoInexistente,
    carregarPlanoUsuario
  ]);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        setUsuario,
        planoUsuario,
        setPlanoUsuario,
        carregarPlanoUsuario,
        consultasUsuario,
        setConsultasUsuario,
        carregarConsultas,
        isConsultasLoading,
        isAuthenticated,
        isAuthReady,
        isPlanoLoading,
        planoInexistente
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