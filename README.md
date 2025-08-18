# Health&Bridge

### 👩‍⚕️ Conectando Nutricionistas e Educadores Físicos a Pacientes em uma única plataforma.

---

### 📋 Visão Geral do Projeto

Health&Bridge é uma aplicação frontend construída com React e TypeScript que atua como uma ponte entre profissionais de saúde (Nutricionistas e Educadores Físicos) e pacientes. O sistema permite que os usuários se cadastrem, façam login e gerenciem seus perfis, visualizem seus planos de saúde e agendem consultas, proporcionando uma experiência completa e integrada.

Este projeto foi desenvolvido com foco em modularidade, reutilização de componentes e tipagem estática para garantir um código limpo, robusto e de fácil manutenção.

### 💻 Tecnologias Utilizadas

* **Frontend:**
    * [**React**](https://reactjs.org/): Biblioteca JavaScript para construção da interface de usuário.
    * [**TypeScript**](https://www.typescriptlang.org/): Superset do JavaScript que adiciona tipagem estática.
    * [**Vite**](https://vitejs.dev/): Ferramenta de build rápida e leve para projetos frontend.
    * [**React Router DOM**](https://reactrouter.com/): Biblioteca para gerenciamento de rotas na aplicação.
* **Estilização:**
    * CSS Modules: Para estilos com escopo local.
    * CSS-in-JS (objetos de estilo): Para estilos inline em componentes.
* **Gerenciamento de Estado:**
    * React Context API: Utilizada para gerenciar o estado global de autenticação (`AuthContext`).

### ✨ Funcionalidades

* **Autenticação:**
    * **Login:** Acesso seguro com e-mail e senha.
    * **Cadastro:** Formulário dinâmico com campos de acesso, informações pessoais, profissionais (CREF/CRN) e endereço (com preenchimento automático de CEP - a ser implementado).
* **Gestão de Perfil:**
    * Visualização e edição de dados pessoais e de contato.
* **Gestão de Plano:**
    * Visualização de um plano de saúde (com renderização condicional se o plano não for nulo).
* **Navegação:**
    * `Header` responsivo para fácil navegação entre as páginas.
* **UI/UX:**
    * Formulários organizados em seções lógicas para uma melhor experiência de usuário.
    * Componentes reutilizáveis (`InfoItem`) para padronização.

### 🚀 Instalação e Execução

Para rodar o projeto em seu ambiente de desenvolvimento, siga os passos abaixo.

#### **Pré-requisitos**

Certifique-se de ter o [Node.js](https://nodejs.org/) (versão 18 ou superior) instalado em sua máquina.

#### **Passo a passo**

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd macros-frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    ```

3.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    yarn dev
    # ou
    pnpm dev
    ```

4.  **Acesse a aplicação:**
    Abra seu navegador e acesse a URL: `http://localhost:5173` (ou a porta indicada pelo seu terminal).

### 📂 Estrutura do Projeto

A organização do projeto segue a seguinte estrutura:
