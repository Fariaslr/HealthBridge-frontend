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
import { buscarPlanoPorPacienteId } from "../services/planoService"; // <-- Usado aqui

// Defina o tipo de usuário que o contexto pode retornar (união de tipos)
type AuthUser =
  | Paciente
  | ProfissionalSaude
  | Pessoa
  | Nutricionista
  | EducadorFisico;

// --- CORREÇÃO AQUI: Adicione carregarPlanoUsuario à interface AuthContextType ---
type AuthContextType = {
  usuario: AuthUser | null;
  setUsuario: (user: AuthUser | null) => void;
  planoUsuario: Plano | null;
  carregarPlanoUsuario: () => Promise<void>; // <--- ADICIONE ESTA LINHA
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isPlanoLoading: boolean;
  planoInexistente: boolean;
};
// --- FIM DA CORREÇÃO ---

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

  // Carrega o plano do paciente, se aplicável (memoizado com useCallback)
  const carregarPlanoUsuario = useCallback(async () => {
    // <--- Função definida aqui
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
      const planoData = await buscarPlanoPorPacienteId(usuario.id); // Acessa usuario.id com segurança
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
  }, [usuario, isPlanoLoading, planoUsuario, planoInexistente]); // Dependências do useCallback

  // Dispara o carregamento do plano automaticamente (useEffect)
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
    }
  }, [
    isAuthReady,
    usuario,
    planoUsuario,
    isPlanoLoading,
    planoInexistente,
    carregarPlanoUsuario,
  ]);

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
