import {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

import type { Pessoa } from "../models/Pessoa";
import type { Paciente } from "../models/Paciente";
import type { ProfissionalSaude } from "../models/ProfissionalSaude";
import type { Nutricionista } from "../models/Nutricionista";
import type { EducadorFisico } from "../models/EducadorFisico";

import type { Plano } from "../models/Plano";
import { buscarPlanoPorPacienteId } from "../services/planoService";

type AuthUser = Paciente | ProfissionalSaude | Pessoa | Nutricionista | EducadorFisico;

type AuthContextType = {
  usuario: AuthUser | null;
  setUsuario: (user: AuthUser | null) => void;
  planoUsuario: Plano | null;
  carregarPlanoUsuario: () => Promise<void>;
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

  const isAuthenticated = !!usuario;
  const isInitialized = useRef(false);

  // Inicializa o usuário com base no localStorage
  useEffect(() => {
    if (!isInitialized.current) {
      try {
        const storedUser = localStorage.getItem("usuario");
        if (storedUser) {
          const parsedUser: AuthUser = JSON.parse(storedUser);
          setUsuarioState(parsedUser);
        }
      } catch {
        localStorage.removeItem("usuario");
      } finally {
        isInitialized.current = true;
        setIsAuthReady(true);
      }
    }
  }, []);

  // Atualiza o estado e o localStorage do usuário
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

  // Carrega o plano do paciente, se aplicável
  const carregarPlanoUsuario = useCallback(async () => {
    if (
      !usuario ||
      usuario.tipoUsuario !== "Paciente" ||
      !usuario.id ||
      isPlanoLoading ||
      planoUsuario ||
      planoInexistente
    ) {
      return;
    }

    setIsPlanoLoading(true);
    try {
      const planoData = await buscarPlanoPorPacienteId(usuario.id);
      if (planoData) {
        setPlanoUsuario(planoData);
        setPlanoInexistente(false);
      } else {
        setPlanoUsuario(null);
        setPlanoInexistente(true);
      }
    } catch {
      setPlanoUsuario(null);
      setPlanoInexistente(true);
    } finally {
      setIsPlanoLoading(false);
    }
  }, [usuario, isPlanoLoading, planoUsuario, planoInexistente]);

  // Dispara o carregamento do plano automaticamente
  useEffect(() => {
    if (!isAuthReady) return;

    if (usuario?.tipoUsuario === "Paciente") {
      carregarPlanoUsuario();
    } else {
      if (planoUsuario !== null) setPlanoUsuario(null);
      if (planoInexistente !== false) setPlanoInexistente(false);
    }
  }, [isAuthReady, usuario, carregarPlanoUsuario]);

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
        planoInexistente,
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
