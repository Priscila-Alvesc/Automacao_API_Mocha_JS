# Projeto de API para Transferências (REST e GraphQL)

Este projeto contém duas implementações de uma API para transferências de valores entre usuários: uma utilizando **REST** e outra com **GraphQL**. O objetivo principal é servir como um ambiente de estudos e demonstração para automação de testes de API.

## ✨ Principais Funcionalidades

- **Gerenciamento de Usuários**: Registro, login e listagem.
- **Transferências**: Realização e consulta de transferências entre contas.
- **Autenticação**: Uso de JWT para proteger rotas.
- **Regras de Negócio**: Limites de transferência e validação de saldo.

## 🚀 Tecnologias Utilizadas

- Node.js
- Express
- GraphQL
- Mocha & Chai (Testes)
- Sinon (Mocks & Stubs)
- Supertest (Requisições HTTP em testes)
- Banco de dados em memória (variáveis)

---

## 🏁 Começando

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### 2. Instalação

1. Clone o repositório:
   ```sh
   git clone <URL-DO-SEU-REPOSITORIO>
   cd Automacao_API_Mocha_JS
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```

### 3. Executando as APIs

O projeto possui dois servidores que podem ser executados separadamente.

#### 🌐 API REST

- Para iniciar o servidor REST, execute:
  ```sh
  npm start
  ```
- A API REST estará disponível em `http://localhost:3000`.
- A documentação Swagger pode ser acessada em `http://localhost:3000/api-docs`.

#### ⚛️ API GraphQL

- Para iniciar o servidor GraphQL, execute:
  ```sh
  npm run start-graphql
  ```
- A API GraphQL estará disponível em `http://localhost:4000/graphql`.
- Você pode usar o GraphQL Playground para interagir com a API nesse endereço.

---

## 📖 Documentação e Endpoints

### API REST (`localhost:3000`)

#### Usuários
- `POST /users/register` - Registra um novo usuário.
  ```json
  { "username": "string", "password": "string", "favorecidos": ["string"] }
  ```
- `POST /users/login` - Autentica um usuário e retorna um token JWT.
  ```json
  { "username": "string", "password": "string" }
  ```
- `GET /users` - Lista todos os usuários.

#### Transferências
- `POST /transfers` - Cria uma nova transferência (requer autenticação).
  ```json
  { "from": "string", "to": "string", "value": number }
  ```
- `GET /transfers` - Lista todas as transferências (requer autenticação).

### API GraphQL (`localhost:4000/graphql`)

#### Queries
- `users`: Lista todos os usuários.
- `transfers`: Lista todas as transferências (requer autenticação).

#### Mutations
- `registerUser(username, password, favorecidos)`: Registra um novo usuário.
- `loginUser(username, password)`: Autentica um usuário e retorna `token` e `User`.
- `createTransfer(from, to, value)`: Cria uma nova transferência (requer autenticação).

---

## 📝 Regras de Negócio

- Não é permitido registrar usuários duplicados.
- Login exige usuário e senha.
- Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos.
- O saldo inicial de cada usuário é de R$ 10.000,00.

## 🧪 Testes Automatizados

Para garantir a qualidade e o funcionamento da API, foram criados testes automatizados que podem ser executados com os seguintes comandos:

### Comandos Principais

```bash
# Executar TODOS os testes
npm test

# Executar apenas testes de controller (com mocks)
npm run test-controller

# Executar apenas testes externos (de integração, sem mocks)
npm run test-external
```

##### Usando yarn:
```bash
# Executar TODOS os testes
yarn test

# Executar apenas testes de controller (com mocks)
yarn test-controller

# Executar apenas testes externos (sem mocks)
yarn test-external

# Iniciar o servidor
yarn start
```

##### Comandos específicos:
```bash
# Executar um arquivo específico
npx mocha test/controller/transferController.test.js
npx mocha test/external/transferExternal.test.js

---

Para dúvidas, consulte a documentação Swagger, GraphQL Playground ou o código-fonte.
