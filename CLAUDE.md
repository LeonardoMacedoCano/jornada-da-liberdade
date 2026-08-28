# Jornada da Liberdade — CLAUDE.md

## Propósito

Guia gamificado de progressão financeira. O jogador avança por 10 fases completando missões objetivas que representam marcos reais da jornada rumo à independência financeira — começando pela eliminação de dívidas. O foco é mostrar que a liberdade financeira é lenta e gradual — e que essa lentidão é parte do jogo, não um problema.

O jogo nunca recomenda ativos, corretoras ou timing de compra/venda — só mostra em qual fase o jogador está e o que fazer em termos de comportamento e disciplina. Ao escrever ou editar conteúdo de missão (`frontend/src/i18n/content/missions.ts`), não citar ticker, corretora, banco ou empresa específicos — só categorias genéricas (renda fixa, ETF, BDR etc.).

O desafio central é **mental**: o jogo existe para mostrar que pequenas vitórias acumuladas vencem o desejo de acelerar a qualquer custo.

## Stack

- **Frontend**: React 18 + Vite + TypeScript + styled-components + lcano-react-ui (`/frontend`)
- **Backend**: Node.js + Express + TypeScript + Prisma ORM (`/backend`)
- **Banco**: PostgreSQL
- **Deploy**: Docker Compose

## Rodar em desenvolvimento

```bash
# Backend (lê .env da raiz automaticamente)
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

Backend sobe em `http://localhost:3001`, frontend em `http://localhost:5173`.

## Arquitetura

```
/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Entry point: seed automático (se banco vazio) + servidor Express
│   │   ├── seed.ts           # Fases e missões do jogo (fonte da verdade)
│   │   ├── routes/           # index → auth, user, phases, missions, config, share
│   │   ├── controllers/      # HTTP: parseia request, chama services/prisma, formata resposta
│   │   ├── services/         # Regras de negócio (ex: progressionService — avanço de fase)
│   │   ├── middleware/       # auth (JWT) e validate (zod)
│   │   └── lib/              # prisma, errors, schemas (zod), serializers, appConfig
│   └── prisma/schema.prisma  # Modelos de dados
└── frontend/
    └── src/
        ├── pages/            # Dashboard, Roadmap, History, Settings, Login, Register, PublicProfile
        ├── components/       # AchievementBadge, MissionItem, PhaseCard, ProgressBar, ...
        ├── contexts/         # AuthContext (JWT) + ThemeControlContext
        ├── services/api.ts   # Axios configurado
        └── types/index.ts    # Interfaces + constantes de UI
```

As migrations do Prisma **não** rodam via código do backend — o `Dockerfile` executa `npx prisma migrate deploy` antes de subir `node dist/index.js` (ver `CMD` em `backend/Dockerfile`). Em desenvolvimento local, rode `npm run db:migrate` manualmente.

## Mecânicas do jogo

### Tipos de missão (`missionType`)

| Tipo | Descrição | Completar |
|---|---|---|
| `portfolio_value` | Meta de patrimônio investido | Auto — ao atualizar dados financeiros |
| `passive_income_sm` | Renda passiva em múltiplos do SM | Auto — ao atualizar dados financeiros |
| `crossover` | Retorno mensal ≥ aporte mensal | Auto — ao atualizar dados financeiros |
| `behavioral` | Ação comportamental (abrir corretora, diversificar etc.) | Manual — o jogador marca quando fez |
| `habit` | Hábito sustentado por tempo (ex: aportes por 12 meses) | Manual |

### Progressão de fase

- Uma fase avança quando todas as missões `isRequiredForPhase = true` estão completas.
- Missões opcionais (`isRequiredForPhase = false`) aparecem na fase mas não bloqueiam o avanço.
- O backend recalcula missões automáticas sempre que `/user/progress` (PUT) é chamado, e o avanço de fase (`services/progressionService.ts`) percorre várias fases em sequência na mesma chamada — um aporte grande de uma vez pode avançar mais de uma fase de uma só vez, desde que as missões manuais das fases intermediárias já estejam concluídas.
- A fase do usuário está em `UserProgress.currentPhaseId`.

### Fases (10 no total)

| id | Slug (`seed.ts`) | Range |
|---|---|---|
| 0 | tutorial | Diagnóstico financeiro — consciência antes de ação |
| 1 | debt-freedom | Eliminar dívidas com juros acima de 1,5% ao mês |
| 2 | recruit | R$ 1 a R$ 10.000 |
| 3 | soldier | R$ 10k a R$ 50k |
| 4 | veteran | R$ 50k a R$ 100k — Clube dos 100k |
| 5 | elite | R$ 100k ao Ponto de Cruzamento (~R$ 300k) |
| 6 | specialist | R$ 300k a R$ 600k |
| 7 | master | R$ 600k ao Primeiro Milhão |
| 8 | hero | R$ 1M a R$ 2M — Independência Financeira |
| 9 | legend | R$ 2M+ — FIRE Completo |

Os nomes de exibição em português (Tutorial, Quitação, Recruta, Soldado, Veterano, Elite, Especialista, Mestre, Herói, Lenda) ficam em `frontend/src/i18n/content/phases.ts` — não confundir com o slug estrutural acima.

## Onde fica o conteúdo do jogo

**`/backend/src/seed.ts`** é a fonte da verdade de fases e missões.

Para adicionar ou editar uma missão, edite o array `missions` no seed e rode:

```bash
cd backend && npm run db:seed
```

O seed usa `upsert` — não apaga dados existentes de usuário.

## Modelos de dados relevantes

- `Phase` — fases estáticas do jogo
- `Mission` — missões de cada fase
- `UserProgress` — dados financeiros do jogador (atualiza e dispara auto-complete)
- `UserMissionProgress` — estado de cada missão por usuário (concluída/data)
- `UserPhaseHistory` — registro histórico de quando cada fase foi concluída
- `AppConfig` — configurações globais key/value (não usado atualmente; salário mínimo vem da env `MINIMUM_WAGE`, não do banco)

## Convenções

- Cores das fases: `gray | red | green | blue | teal | purple | orange | yellow | amber | rose`
- Todas as rotas da API ficam sob `/api`
- Autenticação via JWT no header `Authorization: Bearer <token>`
- O salário mínimo vem da env `MINIMUM_WAGE` (formato decimal com ponto, ex: `1621.00`) e é usado para calcular metas de renda passiva em SM. Atualize manualmente todo janeiro, quando o valor nacional muda
- Perfil público em `/p/:username` — nunca expõe dados financeiros a não ser que `showFinancialValues = true`

## Decisões de produto deliberadas

- **Login exclusivo via Google (sem email/senha):** decisão de produto, não lacuna. Simplifica onboarding (sem fluxo de recuperação de senha, sem gestão de credenciais) e a maioria do público-alvo já tem conta Google. Não sugerir adicionar login por email/senha sem essa decisão ser revisitada explicitamente.

## Estilo CSS

O frontend usa **styled-components** com o tema da biblioteca `lcano-react-ui` gerenciado pelo `ThemeControlProvider`.

**Regras obrigatórias:**
- Nunca usar hex hardcoded (`#fff`, `#1a1a2e`) ou `rgba`/`rgb` com valores literais fora do `theme.ts`
- Toda cor deve vir de `theme.colors.*` (ex: `${p => p.theme.colors.primary}`)
- Para variações de opacidade, anexar o sufixo hex à cor do tema (ex: `${p => p.theme.colors.white}0d` para 5%)
- A única exceção são `PHASE_HEX_COLORS` em `types/index.ts`, que representam cores específicas de cada fase do jogo
- O tema em `frontend/src/theme.ts` é a única fonte da verdade para valores de cor

## Commits

Seguir o padrão [Conventional Commits](https://github.com/iuricode/padroes-de-commits), sem ícones, em uma única linha:

```
<tipo>: <descrição curta no imperativo>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Tipos aceitos: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `perf`, `ci`, `build`

Regras:
- A linha `Co-Authored-By` é obrigatória quando o commit foi feito com auxílio do Claude
- Nunca incluir `Claude-Session` ou qualquer outra metadado de sessão na mensagem

Exemplos:
```
feat: adicionar tela de histórico de missões

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```
```
fix: corrigir calculo do ponto de cruzamento

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```
