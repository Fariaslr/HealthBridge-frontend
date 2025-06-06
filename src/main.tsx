import 'normalize.css'; // <--- Adicione esta linha AQUI
import "./index.css"; // Seus estilos globais (devem vir depois do normalize)
import App from "./App.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);