# Projeto: Aplicação Web de Acompanhamento de Estoque de Alimentos da Dispensa

## Descrição
Aplicação web para controle e acompanhamento do estoque de alimentos de uma dispensa doméstica, permitindo o registro de consumo, consulta de progresso e gestão de itens. O sistema possui dois tipos de usuários: **Dono da Casa** (acesso total) e **Comprador** (acesso de consulta).

A aplicação utiliza uma API REST documentada em `swagger.yaml` e roda em Express na porta 4000. O frontend é construído com HTML, CSS e o framework Bulma para estilização.

## Funcionalidades
- Login para Dono da Casa e Comprador
- Listagem de alimentos em estoque
- Adição, edição e remoção de alimentos (Dono da Casa)
- Registro e histórico de consumo de alimentos
- Consulta de progresso de consumo
- Mensagens de erro amigáveis para falhas de API


## Endpoints principais da API
- `POST /auth/login` — Login de usuário
- `POST /auth/logout` — Logout
- `GET /alimentos` — Listar alimentos
- `POST /alimentos` — Adicionar alimento
- `DELETE /alimentos/{id}` — Remover alimento

## Regras de Negócio
1. Apenas usuários autenticados podem acessar funcionalidades protegidas da API (login obrigatório).
2. Somente o Dono da Casa pode adicionar, editar ou remover alimentos do estoque.
3. Não é permitido registrar consumo de alimentos inexistentes ou com quantidade insuficiente em estoque.
4. O Comprador pode apenas consultar o estoque e progresso, sem alterar dados.
5. Ao remover um alimento, ele deve ser excluído do estoque e não aparecer nas consultas subsequentes.

Detalhes:
- `GET /alimentos` — Lista todos os alimentos em estoque.
- `POST /alimentos` — Cria um novo alimento (body: nome, quantidade, unidade).
- `DELETE /alimentos/{id}` — Remove um alimento pelo ID.

Veja detalhes completos no arquivo [`swagger.yaml`](./swagger.yaml).

## Tecnologias Utilizadas
- Node.js + Express
- Bulma CSS
- EJS para renderização de views
- Axios para requisições HTTP

## Como rodar o projeto
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie a API (deve estar rodando em http://localhost:3000/ conforme especificado no `swagger.yaml`).
3. Inicie a aplicação web:
   ```bash
   node app.js
   ```
4. Acesse em [http://localhost:4000/](http://localhost:4000/)

## Estrutura de Usuários (mock)
- Dono da Casa: usuário `dono`, senha `dono123`
- Comprador: usuário `comprador`, senha `comprador123`

# Projeto: Aplicação Web de Acompanhamento de Estoque de Alimentos da Dispensa

## Descrição
Aplicação web para controle e acompanhamento do estoque de alimentos de uma dispensa doméstica. Dois papéis de usuário são suportados:

- Dono da Casa — acesso total (gerenciar estoque e registrar consumo)
- Comprador — acesso de consulta (visualizar progresso e estoque)

O frontend roda em Express na porta 4000 e consome a API REST que roda em http://localhost:3000. A API é documentada em OpenAPI (Swagger) em `resources/swagger.yaml`.

## Funcionalidades
- Autenticação (mock)
- Listagem, criação, atualização e remoção de alimentos (Dono)
- Registro de consumo e histórico
- Consulta de progresso de consumo
- Documentação Swagger em `/docs`

## Endpoints principais da API
- `POST /auth/login` — Login de usuário
- `POST /auth/logout` — Logout
- `GET /alimentos` — Listar alimentos
- `POST /alimentos` — Adicionar alimento
- `DELETE /alimentos/{id}` — Remover alimento
 - `GET /alimentos` — Listar alimentos
 - `POST /alimentos` — Adicionar alimento
 - `DELETE /alimentos/{id}` — Remover alimento

Detalhes e formatos de resposta estão em `resources/swagger.yaml`.

## Tecnologias
- Node.js + Express
- Bulma CSS (frontend)
- EJS (templates)
- Axios (frontend → API)
- Swagger UI (documentação)

## Como rodar o projeto
1. Instale as dependências:

```bash
npm install
```

2. Inicie apenas a API (porta 3000):

```bash
npm run start:api
```

3. Inicie apenas o frontend (porta 4000):

```bash
npm run start:web
```

4. Iniciar API e frontend juntos (um comando):

```bash
npm run start:all
```

5. URLs úteis:

- API: http://localhost:3000/
- Documentação Swagger: http://localhost:3000/docs
- Frontend: http://localhost:4000/

Observação: após qualquer alteração no `package.json` (instalação de novas dependências), execute `npm install` antes de rodar os scripts.

## Usuários de exemplo (mock)
- Dono da Casa: usuário `dono`, senha `dono123`
- Comprador: usuário `comprador`, senha `comprador123`

## Estrutura de Pastas (resumida)
- `app.js` — API (porta 3000)
- `web.js` — Frontend (porta 4000)
- `routes/`, `controllers/`, `service/`, `model/` — camadas da API
- `resources/swagger.yaml` — definição OpenAPI
- `views/`, `public/` — frontend

## Próximos passos possíveis
- Adicionar persistência real (banco) em vez de memória
- Testes automatizados
- Autenticação real (JWT / OAuth)

## Licença
Projeto para fins didáticos.
