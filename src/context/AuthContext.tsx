import { createContext, useState, useContext, useEffect, useRef } from "react"; // Importe useRef
import type { ReactNode } from "react";
import type { Pessoa } from "../models/Pessoa";
import type { Plano } from "../models/Plano";
import { buscarPlanoPorPacienteId } from "../services/planoService";

type AuthContextType = {
  usuario: Pessoa | null;
  setUsuario: (user: Pessoa | null) => void;
  planoUsuario: Plano | null;
  carregarPlanoUsuario: () => Promise<void>;
  isAuthenticated: boolean;
  isAuthReady: boolean; // <--- NOVO: Indica se o estado de autenticação já foi determinado
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuarioState] = useState<Pessoa | null>(null); // Inicializa com null
  const [planoUsuario, setPlanoUsuario] = useState<Plano | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // <--- NOVO ESTADO: Começa como false

  const isAuthenticated = !!usuario;

  // Ref para garantir que a inicialização do localStorage só aconteça uma vez
  const isInitialized = useRef(false);

  // Efeito para carregar o usuário do localStorage na montagem inicial do AuthProvider
  useEffect(() => {
    if (!isInitialized.current) { // Garante que roda apenas uma vez
      const storedUser = localStorage.getItem("usuario");
      if (storedUser) {
        setUsuarioState(JSON.parse(storedUser));
      }
      setIsAuthReady(true); // <--- Marca como pronto APÓS verificar localStorage
      isInitialized.current = true;
    }
  }, []);

  const setUsuario = (user: Pessoa | null) => {
    if (user) {
      localStorage.setItem("usuario", JSON.stringify(user));
    } else {
      localStorage.removeItem("usuario");
      setPlanoUsuario(null);
    }
    setUsuarioState(user);
  };

  const carregarPlanoUsuario = async () => {
    if (!usuario?.id) {
      setPlanoUsuario(null);
      return;
    }

    if (planoUsuario) {
      return;
    }

    try {
      const planoData = await buscarPlanoPorPacienteId(usuario.id);
      setPlanoUsuario(planoData);
    } catch (error) {
      console.error("Erro ao carregar plano no AuthContext:", error);
      setPlanoUsuario(null);
    }
  };

  useEffect(() => {
    if (isAuthReady && usuario) { 
      carregarPlanoUsuario();
    } else if (isAuthReady && !usuario) { 
      setPlanoUsuario(null);
    }
  }, [usuario, carregarPlanoUsuario, isAuthReady]); 
  return (
    <AuthContext.Provider
      value={{
        usuario,
        setUsuario,
        planoUsuario,
        carregarPlanoUsuario,
        isAuthenticated,
        isAuthReady, 
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