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
- K6 (Testes de Performance para POST /transfers)
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
  npm run start-rest
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
```

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

#### Teste de Performance com K6:

Este projeto inclui um teste de performance utilizando K6 para simular carga na API REST, focando no fluxo de login e transferência entre usuários.

### Pré-requisitos para o Teste K6

- K6 instalado (disponível em [k6.io](https://k6.io/)).
- API REST em execução (veja seção "Executando as APIs").

### Funcionamento do Teste (`test/K6/Transfer-script.ts`)

O teste utiliza stages para simular um perfil de carga realista: começa com ramp-up para 10 VUs em 3s, mantém 10 VUs por 15s, pica para 100 VUs em 2s e mantém por 3s, volta para 10 VUs por 5s, e finaliza com ramp-down para 0 VUs em 5s. O threshold de performance é: percentil 95 da duração das requests deve ser ≤ 2000ms.

        export const options = {
          stages: [
                { duration: '3s', target: 10 },     // Ramp up
                { duration: '15s', target: 10 },    // Average
                { duration: '2s', target: 100 },    // Spike
                { duration: '3s', target: 100 },    // Spike
                { duration: '5s', target: 10 },     // Average
                { duration: '5s', target: 0 },      // Ramp down
            ],
          thresholds: {
            http_req_duration: ['p(95)<=2000']
          }
        };

Atraves do arquivo test/k6/checkout.test.js e demontra o uso do conceito de Groups e dentro dele faço uso de um helpers para modularizar e reutilizar código, facilitando a manutenção e a legibilidade do script principal.

Dentro do groups, é executada a função loginUser(username, password, baseUrl), que foi importada do helper loginHelper.js

        group('Login', function() {
            const loginResponse = loginUser(username, password, baseUrl);
            const token = loginResponse.json('token');
          });
  
Com token é possível autenticar no metodo Post\Transfers, que agrupa ações de transferências:

        group('Transfer', function() {
          const loginResponse = loginUser(username, password, baseUrl); 
          const token = loginResponse.json('token');
              ...
        });  
        
 E temos a group User Think Time: que executa `sleep(1)` para simular tempo de reflexão do usuário:
 
        group('User Think Time', function() {
            sleep(1);
          });
          

### Executando o Teste K6

Para executar o teste de performance:

```sh
k6 run test/K6/Transfer-script.ts
```

Para executar com dashboard web e exportar relatório HTML:

```sh
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html K6_WEB_DASHBOARD_PERIOD=10s k6 run test/K6/Transfer-script.ts
```

Nota: Certifique-se de que a API REST esteja rodando em `http://localhost:3000` (ou configure `BASE_URL` via variável de ambiente).

---## Helpers Utilizados no Teste K6

### 1. `baseUrlHelper.js`
- **Localização**: `test/k6/helpers/baseUrlHelper.js`
- **Descrição**: Fornece a URL base da API, permitindo configuração via variável de ambiente.

  export function getBaseUrl() {
  return __ENV.BASE_URL || 'http://localhost:3000';
}


### 2. `loginHelper.js`
- **Localização**: `test/k6/helpers/loginHelper.js`
- **Descrição**: Realiza o login do usuário e valida a resposta.
- **Função Principal**: `loginUser(username, password, baseUrl)`

export function loginUser(username, password, baseUrl) {
  const response = http.post(
    `${baseUrl}/users/login`,
    JSON.stringify({ username, password }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );


### 3. `randomUserHelper.js`
- **Localização**: `test/k6/helpers/randomUserHelper.js`
- **Descrição**: Seleciona aleatoriamente um usuário da lista de usuários disponíveis.
- **Função Principal**: `getRandomUser()`

const users = ['julio', 'priscila'];

export function getRandomUser() {
  return users[Math.floor(Math.random() * users.length)];
}


