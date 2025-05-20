import { useAuth } from "../context/AuthContext"

export default function Home () {
    const  pessoa  = useAuth();
    return (
      <div>
      <h1>Bem-vindo à Página Principal</h1>
      <h2>Dados da Pessoa Logada:</h2>
      {pessoa? (
        <pre>{JSON.stringify(pessoa, null, 2)}</pre>
      ) : (
        <p>Nenhum usuário logado.</p>
      )}
    </div>
    )
}
