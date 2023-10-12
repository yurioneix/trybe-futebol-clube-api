# Trybe Futebol Clube ⚽

<br>

## Premissa do projeto 

O TFC é um site informativo sobre partidas e classificações de futebol! ⚽️

No time de desenvolvimento do TFC, seu squad ficou responsável por desenvolver uma API (utilizando o método TDD) e também integrar - através do docker-compose - as aplicações para que elas funcionem consumindo um banco de dados.

Nesse projeto, você vai construir um back-end dockerizado utilizando modelagem de dados através do Sequelize. Seu desenvolvimento deve respeitar regras de negócio providas no projeto e sua API deve ser capaz de ser consumida por um front-end já provido nesse projeto.

Para adicionar uma partida é necessário ter um token, portanto a pessoa deverá estar logada para fazer as alterações. Teremos um relacionamento entre as tabelas teams e matches para fazer as atualizações das partidas.

O seu back-end deverá implementar regras de negócio para popular adequadamente a tabela disponível no front-end que será exibida para a pessoa usuária do sistema.

<details>
<summary><strong> Estrutura do projeto</strong></summary><br />

O projeto é composto de 4 entidades importantes para sua estrutura:

1️⃣ **Banco de dados:**
  - Será um container docker MySQL já configurado no docker-compose através de um serviço definido como `db`.
  - Tem o papel de fornecer dados para o serviço de _backend_.
  - Durante a execução dos testes sempre vai ser acessado pelo `sequelize` e via porta `3306` do `localhost`;
  - Você também pode conectar a um Cliente MySQL (Workbench, Beekeeper, DBeaver e etc), colocando as credenciais configuradas no docker-compose no serviço `db`.

2️⃣ **Back-end:**
 - Será o ambiente que você realizará a maior parte das implementações exigidas.
 - Deve rodar na porta `3001`, pois o front-end faz requisições para ele nessa porta por padrão;
 - Sua aplicação deve ser inicializada a partir do arquivo `app/backend/src/server.ts`;
 - Garanta que o `express` é executado e a aplicação ouve a porta que vem das variáveis de ambiente;
 - Todas as dependências extras (tal como `joi`, `boom`, `express-async-errors`...) devem ser listadas em `app/backend/packages.npm`.

3️⃣ **Front-end:**
  - O front já está concluído, não é necessário realizar modificações no mesmo. A única exceção será seu Dockerfile que precisará ser configurado.
  - Todos os testes a partir do requisito de login usam o `puppeteer` para simular uma pessoa acessando o site `http://localhost:3000/`;
  - O front se comunica com serviço de back-end pela url `http://localhost:3001` através dos endpoints que você deve construir nos requisitos.
  - Recomendamos que sempre que implementar um requisito no back-end acesse a página no front-end que consome a implementação para validar se está funcionando como esperado.

4️⃣ **Docker:**
  - O `docker-compose` tem a responsabilidade de unir todos os serviços conteinerizados (backend, frontend e db) e subir o projeto completo com o comando `npm run compose:up`;
  - Você **deve** configurar as `Dockerfiles` corretamente nas raízes do `front-end` e `back-end`, para conseguir inicializar a aplicação;

</details>

<br>

## Instalação

- Na raiz do projeto, você deverá subir os containers dos serviços de backend, frontend e db através do docker-compose, executando o seguinte comando:
  
  ```bash
    npm run compose:up
  ```
- Para se certificar que as dependências de cada container de serviço foram instaladas, execute o seguinte comando:

  ```bash
    npm run install:apps
  ```
- Agora basta acessar o endereço `localhost:3000/login` onde está mapeado o Frontend da aplicação e logar com o usuário: `user@user.com` e senha: `secret_user`, para assim ter acesso a rotas que necessitam autenticação.

<br> 

## Endpoints

- <strong> GET `/teams` </strong>

<details>
  <summary>Lista todos os times</summary>

  - Retorna `status HTTP 200` com o seguinte resultado:
    ```json
    [
      {
        "id": 1,
        "teamName": "Avaí/Kindermann"
      },
      {
        "id": 2,
        "teamName": "Bahia"
      },
      {
        "id": 3,
        "teamName": "Botafogo"
      },
      ...
    ]
    ```
</details>

<br> 

- <strong> GET `teams/:id` </strong>

<details>
  <summary>Lista um time pelo seu id</summary>

  - Retorna resposta com status `200` e com um `json` contendo o retorno no seguinte modelo:

```json
{
  "id": 5,
  "teamName": "Cruzeiro"
}
```

</details>

<br>

- <strong> POST `/login` </strong>

<details>
  <summary>Realiza login no app</summary>

  - O body da requisição deve conter o seguinte formato:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

  - O campo `email` deve receber um email válido. Ex: `tfc@projeto.com`;
  - O campo `password` deve ter mais de 6 caracteres.
  - Além de válidos, é necessário que o email e a senha estejam cadastrados no banco para ser feito o login;

  - Se o login foi feito com sucesso, o resultado retornado deverá ser similar ao exibido abaixo, com um status http `200`:

    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjU0NTI3MTg5fQ.XS_9AA82iNoiVaASi0NtJpqOQ_gHSHhxrpIdigiT-fc" // Aqui deve ser o token gerado pelo backend.
    }
    ```

   - Se o login não tiver o campo "email" ou "password", o resultado retornado deverá ser a mensagem abaixo, com um status http `400`:

      ```json
        { "message": "All fields must be filled" }
      ```

  - Se o login tiver o "email" **inválido** ou a "senha" **inválida**, o resultado retornado será similar ao exibido abaixo, com um status http `401`:

  ```json
    { "message": "Invalid email or password" }
  ```

- Sendo emails inválidos:
  - Emails com formato inválido: `@exemplo.com`, `exemplo@exemplo`, `exemplo@.com`, `exemplo.exemplo.com`;
  - Emails com formato válido, mas não cadastrados no banco;
- Sendo senhas inválidas:
  - Senhas com formato inválido: com um tamanho **menor** do que `6 caracteres`;
  - Senhas com formato válido, mas não cadastradas no banco;


</details>

<br>

- <strong>GET `/login/role`</strong>

<details>
  <summary>Mostra o tipo de usuário</summary>

   - Caso o token não seja informado, deve-se retornar, com um status `401`, a seguinte mensagem:
      ```json
      { "message": "Token not found" }
      ```

  - Caso o token informado não seja válido, deve-se retornar, com um status `401`, a seguinte mensagem:
    ```json
    { "message": "Token must be a valid token" }
    ```

  - A resposta deve ser de status `200` com um `objeto` contendo a `role` do *user*:
    ```json
      { "role": "admin" }
    ```
</details>

<br>

- <strong> GET `/matches` </strong>

<details>
  <summary>Lista todas as partidas</summary>

  - O resultado esperado deverá ser conforme abaixo:
    ```json
      [
        {
          "id": 1,
          "homeTeamId": 16,
          "homeTeamGoals": 1,
          "awayTeamId": 8,
          "awayTeamGoals": 1,
          "inProgress": false,
          "homeTeam": {
            "teamName": "São Paulo"
          },
          "awayTeam": {
            "teamName": "Grêmio"
          }
        },
        ...
        {
          "id": 41,
          "homeTeamId": 16,
          "homeTeamGoals": 2,
          "awayTeamId": 9,
          "awayTeamGoals": 0,
          "inProgress": true,
          "homeTeam": {
            "teamName": "São Paulo"
          },
          "awayTeam": {
            "teamName": "Internacional"
          }
        }
      ]
      ```

</details>

<br>

- <strong> GET `matches?inProgress=true` </strong>

<details>
  <summary>Lista todas as partidas em andamento</summary>

  Exemplo de retorno da requisição:
    ```json
    [
      {
        "id": 41,
        "homeTeamId": 16,
        "homeTeamGoals": 2,
        "awayTeamId": 9,
        "awayTeamGoals": 0,
        "inProgress": true,
        "homeTeam": {
          "teamName": "São Paulo"
        },
        "awayTeam": {
          "teamName": "Internacional"
        }
      },
      {
        "id": 42,
        "homeTeamId": 6,
        "homeTeamGoals": 1,
        "awayTeamId": 1,
        "awayTeamGoals": 0,
        "inProgress": true,
        "homeTeam": {
          "teamName": "Ferroviária"
        },
        "awayTeam": {
          "teamName": "Avaí/Kindermann"
        }
      }
    ]
    ```
</details>

<br>

- <strong> GET `matches?inProgress=false` </strong>

<details>
  <summary>Lista todas as partidas finalizadas</summary>

   Exemplo de retorno da requisição:
   
  ```json
    [
      {
        "id": 1,
        "homeTeamId": 16,
        "homeTeamGoals": 1,
        "awayTeamId": 8,
        "awayTeamGoals": 1,
        "inProgress": false,
        "homeTeam": {
          "teamName": "São Paulo"
        },
        "awayTeam": {
          "teamName": "Grêmio"
        }
      },
      {
        "id": 2,
        "homeTeamId": 9,
        "homeTeamGoals": 1,
        "awayTeamId": 14,
        "awayTeamGoals": 1,
        "inProgress": false,
        "homeTeam": {
          "teamName": "Internacional"
        },
        "awayTeam": {
          "teamName": "Santos"
        }
      }
    ]
  ```
</details>

<br>

- <strong> PATCH `/matches/:id/finish`</strong>

<details>
  <summary>Finaliza uma partida em andamento</summary>
  
  - Caso o token não seja informado, deve-se retornar, com um status `401`, a seguinte mensagem:
  
    ```json
    { "message": "Token not found" }
    ```
  
  - Caso o token informado não seja válido, deve-se retornar, com um status `401`, a seguinte mensagem:
  
    ```json
    { "message": "Token must be a valid token" }
    ```
  
  - Deve-se retornar, com um status `200`, a seguinte mensagem:
  
    ```json
    { "message": "Finished" }
    ```
</details>

<br>

- <strong> PATCH `/matches/:id` </strong>

<details>
  <summary>Atualiza partidas em andamento</summary>

  - O corpo da requisição terá o seguinte formato:

    ```json
    {
      "homeTeamGoals": 3,
      "awayTeamGoals": 1
    }
    ```

  - Caso o token não seja informado, deve-se retornar, com um status `401`, a seguinte mensagem:

    ```json
    { "message": "Token not found" }
    ```

  - Caso o token informado não seja válido, deve-se retornar, com um status `401`, a seguinte mensagem:
  
    ```json
    { "message": "Token must be a valid token" }
    ```
</details>

<br> 

- <strong> POST `/matches` </strong>

<details>
  <summary>Cadastra uma nova partida</summary>

  - O corpo da requisição terá o seguinte formato:

    ```json
    {
      "homeTeamId": 16, // O valor deve ser o id do time
      "awayTeamId": 8, // O valor deve ser o id do time
      "homeTeamGoals": 2,
      "awayTeamGoals": 2,
    }
    ```

  - Caso o token não seja informado, deve-se retornar, com um status `401`, a seguinte mensagem:
  
    ```json
    { "message": "Token not found" }
    ```

  - Caso o token informado não seja válido, deve-se retornar, com um status `401`, a seguinte mensagem:

    ```json
    { "message": "Token must be a valid token" }
    ```

  - Caso tente-se inserir uma partida entre o time e ele mesmo, deve-se retornar, com um status `422`, a seguinte mensagem:

  ```json
  { "message": "It is not possible to create a match with two equal teams" }
  ```

  - Caso a partida seja inserida com sucesso, deve-se retornar os dados da partida, com _status_ `201`:

    ```json
    {
      "id": 1,
      "homeTeamId": 16,
      "homeTeamGoals": 2,
      "awayTeamId": 8,
      "awayTeamGoals": 2,
      "inProgress": true,
    }
    ```
</details>

<br>

- <strong> GET `/leaderboard/home` </strong>

<details>
  <summary>Retorna a classificação dos times da casa</summary>

  - Exemplo de retorno:

    ```json
      [
        {
          "name": "Santos",
          "totalPoints": 9,
          "totalGames": 3,
          "totalVictories": 3,
          "totalDraws": 0,
          "totalLosses": 0,
          "goalsFavor": 9,
          "goalsOwn": 3,
          "goalsBalance": 6,
          "efficiency": "100.00"
        },
        {
          "name": "Palmeiras",
          "totalPoints": 7,
          "totalGames": 3,
          "totalVictories": 2,
          "totalDraws": 1,
          "totalLosses": 0,
          "goalsFavor": 10,
          "goalsOwn": 5,
          "goalsBalance": 5,
          "efficiency": "77.78"
        },
        {
          "name": "Corinthians",
          "totalPoints": 6,
          "totalGames": 2,
          "totalVictories": 2,
          "totalDraws": 0,
          "totalLosses": 0,
          "goalsFavor": 6,
          "goalsOwn": 1,
          "goalsBalance": 5,
          "efficiency": "100.00"
        },
        {
          "name": "Grêmio",
          "totalPoints": 6,
          "totalGames": 2,
          "totalVictories": 2,
          "totalDraws": 0,
          "totalLosses": 0,
          "goalsFavor": 4,
          "goalsOwn": 1,
          "goalsBalance": 3,
          "efficiency": "100.00"
        },
        {
          "name": "Real Brasília",
          "totalPoints": 6,
          "totalGames": 2,
          "totalVictories": 2,
          "totalDraws": 0,
          "totalLosses": 0,
          "goalsFavor": 2,
          "goalsOwn": 0,
          "goalsBalance": 2,
          "efficiency": "100.00"
        },
        {
          "name": "São Paulo",
          "totalPoints": 4,
          "totalGames": 2,
          "totalVictories": 1,
          "totalDraws": 1,
          "totalLosses": 0,
          "goalsFavor": 4,
          "goalsOwn": 1,
          "goalsBalance": 3,
          "efficiency": "66.67"
        },
        {
          "name": "Internacional",
          "totalPoints": 4,
          "totalGames": 3,
          "totalVictories": 1,
          "totalDraws": 1,
          "totalLosses": 1,
          "goalsFavor": 4,
          "goalsOwn": 6,
          "goalsBalance": -2,
          "efficiency": "44.44"
        },
        {
          "name": "Botafogo",
          "totalPoints": 4,
          "totalGames": 3,
          "totalVictories": 1,
          "totalDraws": 1,
          "totalLosses": 1,
          "goalsFavor": 2,
          "goalsOwn": 4,
          "goalsBalance": -2,
          "efficiency": "44.44"
        },
        {
          "name": "Ferroviária",
          "totalPoints": 3,
          "totalGames": 2,
          "totalVictories": 1,
          "totalDraws": 0,
          "totalLosses": 1,
          "goalsFavor": 3,
          "goalsOwn": 2,
          "goalsBalance": 1,
          "efficiency": "50.00"
        },
        {
          "name": "Napoli-SC",
          "totalPoints": 2,
          "totalGames": 2,
          "totalVictories": 0,
          "totalDraws": 2,
          "totalLosses": 0,
          "goalsFavor": 2,
          "goalsOwn": 2,
          "goalsBalance": 0,
          "efficiency": "33.33"
        },
        {
          "name": "Cruzeiro",
          "totalPoints": 1,
          "totalGames": 2,
          "totalVictories": 0,
          "totalDraws": 1,
          "totalLosses": 1,
          "goalsFavor": 2,
          "goalsOwn": 3,
          "goalsBalance": -1,
          "efficiency": "16.67"
        },
        {
          "name": "Flamengo",
          "totalPoints": 1,
          "totalGames": 2,
          "totalVictories": 0,
          "totalDraws": 1,
          "totalLosses": 1,
          "goalsFavor": 1,
          "goalsOwn": 2,
          "goalsBalance": -1,
          "efficiency": "16.67"
        },
        {
          "name": "Minas Brasília",
          "totalPoints": 1,
          "totalGames": 3,
          "totalVictories": 0,
          "totalDraws": 1,
          "totalLosses": 2,
          "goalsFavor": 3,
          "goalsOwn": 6,
          "goalsBalance": -3,
          "efficiency": "11.11"
        },
        {
          "name": "Avaí/Kindermann",
          "totalPoints": 1,
          "totalGames": 3,
          "totalVictories": 0,
          "totalDraws": 1,
          "totalLosses": 2,
          "goalsFavor": 3,
          "goalsOwn": 7,
          "goalsBalance": -4,
          "efficiency": "11.11"
        },
        {
          "name": "São José-SP",
          "totalPoints": 0,
          "totalGames": 3,
          "totalVictories": 0,
          "totalDraws": 0,
          "totalLosses": 3,
          "goalsFavor": 2,
          "goalsOwn": 5,
          "goalsBalance": -3,
          "efficiency": "0.00"
        },
        {
          "name": "Bahia",
          "totalPoints": 0,
          "totalGames": 3,
          "totalVictories": 0,
          "totalDraws": 0,
          "totalLosses": 3,
          "goalsFavor": 0,
          "goalsOwn": 4,
          "goalsBalance": -4,
          "efficiency": "0.00"
        }
      ]
    ```
</details>

<br> 

## Pastas/arquivos desenvolvidos por mim

```bash
  app/backend/Dockerfile
  app/backend/.env
  app/backend/src/controllers/
  app/backend/src/database/migrations/
  app/backend/src/database/models/
  app/backend/src/interfaces/
  app/backend/src/middlewares/
  app/backend/src/routes/
  app/backend/src/services/
  app/backend/src/tests
  app/backend/src/utils/
  app/frontend/Dockerfile
```
