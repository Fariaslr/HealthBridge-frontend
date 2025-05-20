import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { Pessoa } from "../models/Pessoa";

type AuthContextType = {
  usuario: Pessoa | null;
  setUsuario: (user: Pessoa | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Inicializa o estado lendo do localStorage
  const [usuario, setUsuarioState] = useState<Pessoa | null>(() => {
    const storedUser = localStorage.getItem("usuario");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Função para atualizar estado + salvar no localStorage
  const setUsuario = (user: Pessoa | null) => {
    if (user) {
      localStorage.setItem("usuario", JSON.stringify(user));
    } else {
      localStorage.removeItem("usuario");
    }
    setUsuarioState(user);
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
''