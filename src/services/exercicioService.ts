export async function buscarExercicios() {
  const url = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Erro ao carregar exercícios");
  }

  const data = await response.json();
  return data;
}
