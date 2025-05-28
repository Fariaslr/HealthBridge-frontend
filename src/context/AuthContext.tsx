import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { Pessoa } from "../models/Pessoa";
import type { Plano } from "../models/Plano";
import { buscarPlanoPorPacienteId } from "../services/planoService";

type AuthContextType = {
  usuario: Pessoa | null;
  setUsuario: (user: Pessoa | null) => void;
  planoUsuario: Plano | null;
  carregarPlanoUsuario: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuarioState] = useState<Pessoa | null>(() => {
    const storedUser = localStorage.getItem("usuario");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [planoUsuario, setPlanoUsuario] = useState<Plano | null>(null);

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
    if (usuario) {
      carregarPlanoUsuario();
    } else {
      setPlanoUsuario(null);
    }
  }, [usuario, carregarPlanoUsuario]);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        setUsuario,
        planoUsuario,
        carregarPlanoUsuario,
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