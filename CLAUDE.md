# Jornada da Liberdade — CLAUDE.md

## Propósito

RPG de progressão financeira. O jogador avança por 10 fases completando missões objetivas que representam marcos reais da jornada rumo à independência financeira — começando pela eliminação de dívidas. O foco é mostrar que a liberdade financeira é lenta e gradual — e que essa lentidão é parte do jogo, não um problema.

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
│   │   ├── index.ts          # Entry point: migrations + seed + servidor Express
│   │   ├── seed.ts           # Fases e missões do jogo (fonte da verdade)
│   │   ├── migrate.ts        # Executa migrations Prisma programaticamente
│   │   ├── routes/           # index → auth, user, phases, missions, config, share
│   │   └── controllers/      # Lógica de negócio por domínio
│   └── prisma/schema.prisma  # Modelos de dados
└── frontend/
    └── src/
        ├── pages/            # Dashboard, Roadmap, History, Settings, Login, Register, PublicProfile
        ├── components/       # AchievementBadge, MissionItem, PhaseCard, ProgressBar, ...
        ├── contexts/         # AuthContext (JWT) + ThemeControlContext
        ├── services/api.ts   # Axios configurado
        └── types/index.ts    # Interfaces + constantes de UI
```

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
- O backend recalcula missões automáticas sempre que `/user/progress` (PUT) é chamado.
- A fase do usuário está em `UserProgress.currentPhaseId`.

### Fases (10 no total)

| id | Slug | Range |
|---|---|---|
| 0 | tutorial | Diagnóstico financeiro — consciência antes de ação |
| 1 | quitacao | Eliminar dívidas com juros acima de 1,5% ao mês |
| 2 | recruta | R$ 1 a R$ 10.000 |
| 3 | soldado | R$ 10k a R$ 50k |
| 4 | veterano | R$ 50k a R$ 100k — Clube dos 100k |
| 5 | elite | R$ 100k ao Ponto de Cruzamento (~R$ 300k) |
| 6 | especialista | R$ 300k a R$ 600k |
| 7 | mestre | R$ 600k ao Primeiro Milhão |
| 8 | heroi | R$ 1M a R$ 2M — Independência Financeira |
| 9 | lenda | R$ 2M+ — FIRE Completo |

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
- `AppConfig` — configurações globais (ex: salário mínimo atual)

## Convenções

- Cores das fases: `gray | red | green | blue | teal | purple | orange | yellow | amber | rose`
- Todas as rotas da API ficam sob `/api`
- Autenticação via JWT no header `Authorization: Bearer <token>`
- O salário mínimo vem de `AppConfig` (chave `minimum_wage`) e é usado para calcular metas de renda passiva em SM
- Perfil público em `/p/:username` — nunca expõe dados financeiros a não ser que `showFinancialValues = true`

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
