import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={headerStyle}>
      <nav style={navStyle}>
        <Link to="/home" style={linkStyle}>Home</Link>
        <Link to="/perfil" style={linkStyle}>Perfil</Link>
        <Link to="/planoPage" style={linkStyle}>Plano</Link>
        <Link to="/consultas" style={linkStyle}>Consultas</Link>
        <Link to="/login" style={linkStyle}>Sair</Link>
      </nav>
    </header>
  );
}

const headerStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  width: "100vw",
  backgroundColor: "#333",
  color: "#fff",
  padding: "1rem",
  zIndex: 1000,
};

const navStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  justifyContent: "center",
};

const linkStyle: React.CSSProperties = {
  color: "#fff",
  textDecoration: "none",
};
