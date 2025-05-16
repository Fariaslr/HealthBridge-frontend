import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

type Usuario = {
  id: string;
  nome: string;
  email: string;
  // outros campos conforme seu backend
}; 
type AuthContextType = {
  usuario: Usuario | null;
  setUsuario: (user: Usuario | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

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
