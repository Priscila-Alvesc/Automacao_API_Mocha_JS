# API de Transferências e Usuários

Esta API permite o registro, login, consulta de usuários e transferências de valores entre usuários. O objetivo é servir de base para estudos de testes e automação de APIs.

app – ponto de entrada da aplicação, configura servidor, middlewares e inicializa rotas
route – define os endpoints e mapeia cada rota para um controlador específico
controller – recebe as requisições das rotas, coordena o fluxo e chama os serviços necessários
service – contém a lógica de negócio e regras de processamento dos dados
model – define a estrutura dos dados e a forma de interagir com o banco de dados

Postman -> App.JS -> Route -> Controller -> Services -> Model -> Bando de dados


## Tecnologias
- Node.js
- Express
- Mocha & Chai (Testes)
- Supertest (Testes de HTTP)
- Swagger (documentação)
- Banco de dados em memória (variáveis)

## Instalação

1. Clone o repositório:
   ```sh
   git clone <URL_DO_SEU_REPOSITORIO>
   cd Automacao_API_Mocha_JS
   ```
2. Instale as dependências do projeto:
   ```sh
   # Usando npm
   npm install

   # Ou usando Yarn
   yarn install
   ```

## Como Rodar a Aplicação

Para iniciar o servidor de desenvolvimento:
```sh
# Usando npm
npm start

# Ou usando Yarn
yarn start
```
- A API estará disponível em `http://localhost:3000`.
- A documentação interativa do Swagger estará em `http://localhost:3000/api-docs`.

## Como Rodar os Testes

O projeto está configurado com Mocha e Chai para testes de unidade e integração.

### Rodar todos os testes
```sh
# Usando npm
npm test

# Ou usando Yarn
yarn test
```

### Rodar suítes de testes específicas
```sh
# Testes de Controller
npm run test-controller
yarn test-controller

# Testes de External
npm run test-external
yarn test-external
```

## Endpoints Principais e Regras de Negócio

### Usuários
- **`POST /users/register`**: Registra um novo usuário.
  - Body: `{ "username": "string", "password": "string", "favorecidos": ["string"] }`
  - *Regra*: Não é permitido registrar usuários com `username` duplicado.
  - *Regra*: O saldo inicial de cada usuário é de R$ 10.000,00.
- **`POST /users/login`**: Autentica um usuário e retorna um token.
  - Body: `{ "username": "string", "password": "string" }`
  - *Regra*: Login exige `username` e `password` corretos.
- **`GET /users`**: Lista todos os usuários cadastrados.

### Transferências
- **`POST /transfers`**: Realiza uma transferência entre usuários.
  - Body: `{ "from": "string", "to": "string", "value": number }`
  - *Regra*: Transferências acima de R$ 5.000,00 só podem ser feitas para usuários na lista de `favorecidos` do remetente.
- **`GET /transfers`**: Lista todas as transferências realizadas.

---

Para mais detalhes sobre os endpoints e seus parâmetros, consulte a documentação Swagger ou o código-fonte.
