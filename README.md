# Jornada da Liberdade

Um RPG de progressão financeira pessoal. Você avança por **9 fases** completando **missões objetivas** que representam marcos reais da jornada rumo à independência financeira — do primeiro aporte até o FIRE completo.

---

## O jogo

Investir é simples. O difícil é o mental: a tentação de acelerar, a frustração dos rendimentos que mal aparecem no início, a sensação de que vai levar uma vida. O jogo existe para mostrar que a resposta a tudo isso é a mesma — continuar.

Cada fase tem missões claras e sem ambiguidade. Algumas são financeiras (atingir R$ 10.000 investidos, renda passiva ≥ 2× SM) e são completadas automaticamente quando você atualiza seus dados. Outras são comportamentais (abrir corretora, documentar estratégia) e você marca quando fez. Ao concluir todas as missões obrigatórias de uma fase, você desbloqueia a conquista da fase e avança.

### As 9 fases

| Fase | Nome | Marco |
|---|---|---|
| 0 | Tutorial — O Despertar | Do zero ao primeiro aporte |
| 1 | Recruta — Plantando a Semente | R$ 1 a R$ 10.000 |
| 2 | Soldado — Construindo a Base | R$ 10.000 a R$ 50.000 |
| 3 | Veterano — A Grande Escalada | R$ 50.000 a R$ 100.000 |
| 4 | Elite — Primeiro Momentum | Do Clube dos 100k ao Ponto de Cruzamento |
| 5 | Especialista — A Máquina Ganha Vida | Renda passiva começa a ser sentida |
| 6 | Mestre — Pré-Aposentado | Trabalho vira opção |
| 7 | Herói — Independência Financeira | Renda passiva sustenta 100% da vida |
| 8 | Lenda — FIRE Completo | Patrimônio cresce mesmo gastando confortavelmente |

### Jogabilidade

- **Dashboard**: acompanhe a fase atual, veja as missões com descrições detalhadas, atualize seus dados financeiros.
- **Roadmap**: veja todas as 9 fases — as concluídas, a fase atual e o que está por vir. Missões das fases futuras já aparecem para você saber o que te espera.
- **Histórico**: vitrine de conquistas com todos os badges (desbloqueados e bloqueados) + linha do tempo de missões concluídas com data.
- **Perfil público**: compartilhe sua jornada em `/p/seunome` sem expor dados financeiros sensíveis.

---

## Configuração e deploy

### Pré-requisitos

- Docker e Docker Compose
- PostgreSQL acessível (externo ou em container separado)

### 1. Configure o `.env`

```bash
cp .env.example .env
```

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `DATABASE_URL` | ✅ | — | URL de conexão PostgreSQL |
| `JWT_SECRET` | ✅ | — | Chave secreta para tokens JWT |
| `NODE_ENV` | — | `production` | Ambiente de execução |
| `BACKEND_PORT` | — | `3001` | Porta do backend |
| `FRONTEND_PORT` | — | `5173` | Porta do frontend |
| `CORS_ORIGIN` | ✅ prod | `http://localhost:5173` | Origens permitidas pelo CORS |
| `FRONTEND_ALLOWED_HOSTS` | ✅ prod | — | Hosts permitidos pelo Vite (sem protocolo) |

Gere um `JWT_SECRET` seguro:

```bash
openssl rand -base64 32
```

Exemplo de `DATABASE_URL`:

```
postgresql://usuario:senha@localhost:5432/jornada_liberdade?schema=jornadaliberdade
```

### 2. Suba com Docker Compose

```bash
docker compose up -d
```

O backend executa migrações e popula o banco automaticamente na primeira inicialização.

### 3. Acesse

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001/api`
- Health: `http://localhost:3001/health`

---

## Desenvolvimento local

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (em outro terminal)
cd frontend && npm install && npm run dev
```

### Scripts do backend

| Comando | Descrição |
|---|---|
| `npm run dev` | Modo desenvolvimento com hot reload |
| `npm run build` | Compila TypeScript |
| `npm run db:migrate` | Executa migrações pendentes |
| `npm run db:seed` | Popula o banco com fases e missões |
| `npm run db:reset` | Reseta e re-popula o banco |
