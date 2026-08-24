# Configuração e deploy

← [Voltar ao README](../README.md)

## Pré-requisitos

- Docker e Docker Compose
- PostgreSQL acessível (externo ou em container separado — não incluso no `docker-compose.yml`)
- Um OAuth Client ID do Google (login é feito exclusivamente via Google)

## 1. Configure o `.env`

```bash
cp .env.example .env
```

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `DATABASE_URL` | sim | — | URL de conexão PostgreSQL (`postgresql://usuario:senha@host:5432/banco?schema=jornadaliberdade`) |
| `JWT_SECRET` | sim | — | Chave secreta para tokens JWT. Gere com `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | sim | — | Client ID OAuth do Google. Crie em [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials) → *Create Credentials* → *OAuth client ID* → *Web application*, com o domínio do frontend em *Authorized JavaScript origins* |
| `MINIMUM_WAGE` | não | `1621.00` | Salário mínimo vigente, usado para calcular metas de renda passiva em SM. Formato decimal com ponto. Atualize todo janeiro |
| `NODE_ENV` | não | `production` | Ambiente de execução |
| `BACKEND_PORT` | não | `3001` | Porta do backend |
| `FRONTEND_PORT` | não | `5173` | Porta do frontend |
| `CORS_ORIGIN` | sim em prod | `http://localhost:5173` | Origens permitidas pelo CORS |
| `FRONTEND_ALLOWED_HOSTS` | sim em prod | — | Hosts permitidos pelo Vite (sem protocolo) |
| `BACKEND_PATH` / `FRONTEND_PATH` | não | `./backend` / `./frontend` | Caminhos de contexto de build do Docker |

## 2. Suba com Docker Compose

```bash
docker compose up -d
```

O backend executa migrações e popula o banco automaticamente na primeira inicialização.

## 3. Acesse

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001/api`
- Health: `http://localhost:3001/health`

---

## Desenvolvimento local

```bash
# Backend (lê .env da raiz automaticamente)
cd backend && npm install && npm run dev

# Frontend, em outro terminal
cd frontend && npm install && npm run dev
```

### Scripts do backend

| Comando | Descrição |
|---|---|
| `npm run dev` | Modo desenvolvimento com hot reload |
| `npm run build` | Compila TypeScript |
| `npm run start` | Roda o build de produção |
| `npm run db:migrate` | Executa migrações pendentes |
| `npm run db:seed` | Popula o banco com fases e missões (fonte: `src/seed.ts`) |
| `npm run db:reset` | Reseta e re-popula o banco |
| `npm run db:generate` | Gera o Prisma Client |

### Scripts do frontend

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento Vite |
| `npm run build` | Build de produção |
| `npm run preview` | Serve o build de produção localmente |
