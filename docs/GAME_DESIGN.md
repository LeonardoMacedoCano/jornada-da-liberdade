# Mecânica do jogo

← [Voltar ao README](../README.md)

## Missões

Cada fase contém missões, que podem ser obrigatórias (bloqueiam o avanço de fase) ou opcionais (ficam disponíveis, mas não travam o progresso). Existem cinco tipos:

| Tipo | Descrição | Como completa |
|---|---|---|
| `portfolio_value` | Meta de patrimônio investido | Automática — ao atualizar os dados financeiros |
| `passive_income_sm` | Renda passiva em múltiplos do salário mínimo | Automática — ao atualizar os dados financeiros |
| `crossover` | Retorno mensal ≥ aporte mensal (Ponto de Cruzamento) | Automática — ao atualizar os dados financeiros |
| `behavioral` | Ação comportamental (ex: abrir corretora, documentar estratégia) | Manual — o jogador marca quando fez |
| `habit` | Hábito sustentado por tempo (ex: aportes por 12 meses seguidos) | Manual |

O backend recalcula as missões automáticas sempre que os dados financeiros do usuário são atualizados. Uma fase avança quando todas as suas missões obrigatórias estão concluídas; missões opcionais continuam visíveis, mas não bloqueiam nada.

## As 10 fases

| # | Fase | Marco | O que muda |
|---|---|---|---|
| 0 | **Tutorial** — O Despertar | Diagnóstico financeiro | Da ignorância financeira à consciência real: mapear dívidas, gastos e sobra mensal antes de investir qualquer centavo |
| 1 | **Quitação** — Quebrando as Correntes | Zerar dívidas com juros acima de 1,5% a.m. | Nenhum investimento vence os juros de cartão rotativo ou cheque especial — a prioridade é eliminar essas dívidas |
| 2 | **Recruta** — Plantando a Semente | R$ 1 a R$ 10.000 | Os rendimentos mal aparecem; é um teste de hábito, não de dinheiro |
| 3 | **Soldado** — Construindo a Base | R$ 10.000 a R$ 50.000 | O portfólio ganha forma real e a estratégia começa a existir |
| 4 | **Veterano** — A Grande Escalada | R$ 50.000 a R$ 100.000 (Clube dos 100k) | Fase psicologicamente mais difícil — mas é o ponto de não retorno do compounding |
| 5 | **Elite** — O Compounding Acorda | R$ 100.000 até o Ponto de Cruzamento | Em meses bons, a valorização de um dia já supera o aporte semanal |
| 6 | **Especialista** — A Máquina Ganha Vida | Ponto de Cruzamento a R$ 600.000 | A renda passiva passa a ter peso real no orçamento |
| 7 | **Mestre** — Pré-Aposentado | R$ 600.000 ao primeiro milhão | Trabalho deixa de ser obrigação e vira opção |
| 8 | **Herói** — Independência Financeira | R$ 1.000.000 a R$ 2.000.000 | O portfólio cobre 100% das despesas, confirmado por meses consecutivos |
| 9 | **Lenda** — FIRE Completo | R$ 2.000.000+ | O patrimônio cresce mesmo com o jogador gastando confortavelmente |

Cores e ícones de cada fase estão em `PHASE_HEX_COLORS` (`frontend/src/types/index.ts`) e nos registros de `Phase` no banco — ambos derivados de `backend/src/seed.ts`, a fonte da verdade estrutural do jogo. Os textos narrativos (nome, subtítulo, frase de efeito) ficam em `frontend/src/i18n/content/phases.ts`.

## Onde editar o conteúdo do jogo

`backend/src/seed.ts` define fases e missões (estrutura, metas, ordem). Para adicionar ou editar uma missão:

```bash
cd backend && npm run db:seed
```

O seed usa `upsert` — não apaga progresso de usuários existentes. Os textos exibidos (nome da fase, descrição da missão etc.) vivem separadamente em `frontend/src/i18n/content/`.
