# Jornada da Liberdade

![CI](https://github.com/LeonardoMacedoCano/jornada-da-liberdade/actions/workflows/ci.yml/badge.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&labelColor=20232a)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

Um guia gamificado feito para acompanhar sua vida financeira ao longo dos anos, não algo que se resolve numa única sessão. O objetivo final é a liberdade financeira: o app te mostra em qual fase você está hoje e o que fazer para avançar até a próxima, com **10 fases** (da preparação inicial e quitação de dívidas ao FIRE completo), missões objetivas, conquistas, histórico de progresso e a opção de compartilhar sua jornada com amigos.

**→ [liberdade.cano.dev.br](https://liberdade.cano.dev.br/)** — instância em produção, login via Google.

## Por quê

Investir é simples. O difícil é o mental: a tentação de acelerar, a frustração dos rendimentos que mal aparecem no início, a sensação de que vai levar uma vida. A Jornada da Liberdade transforma isso em um jogo com metas claras e progresso visível, para mostrar que a resposta é sempre a mesma — continuar.

Cada fase tem missões sem ambiguidade. Algumas são financeiras (ex: atingir R$ 10.000 investidos) e se completam sozinhas quando você atualiza seus dados. Outras são comportamentais (ex: abrir uma corretora) e você marca quando fez. Complete todas as obrigatórias de uma fase e ela avança, desbloqueando uma conquista.

O jogo mostra em qual fase você está e o que fazer a seguir — nunca recomenda um ativo, corretora ou momento de compra específico. Isso continua sendo escolha sua. Detalhes de mecânica, fases iniciais de preparação e público-alvo: **[docs/GAME_DESIGN.md](docs/GAME_DESIGN.md)**.

## O que dá pra fazer no app

| Tela | O que é |
|---|---|
| **Dashboard** | Fase atual, missões pendentes e atualização dos seus dados financeiros |
| **Roadmap** | As 10 fases da jornada, incluindo as futuras — para você saber o que vem pela frente |
| **Histórico** | Vitrine de conquistas (badges) e linha do tempo de missões concluídas |
| **Perfil público** | Compartilhe sua jornada em `/p/seu-usuario`, sem expor valores financeiros |

Login é feito exclusivamente via Google (sem cadastro de senha).

## As 10 fases, resumidas

| # | Fase | Marco |
|---|---|---|
| 0 | Tutorial | Diagnóstico financeiro |
| 1 | Quitação | Zerar dívidas com juros altos |
| 2 | Recruta | R$ 1 a R$ 10.000 |
| 3 | Soldado | R$ 10k a R$ 50k |
| 4 | Veterano | R$ 50k a R$ 100k |
| 5 | Elite | R$ 100k ao Ponto de Cruzamento |
| 6 | Especialista | Ponto de Cruzamento a R$ 600k |
| 7 | Mestre | R$ 600k ao primeiro milhão |
| 8 | Herói | R$ 1M a R$ 2M — Independência Financeira |
| 9 | Lenda | R$ 2M+ — FIRE Completo |

Narrativa completa de cada fase e as regras de progressão: **[docs/GAME_DESIGN.md](docs/GAME_DESIGN.md)**.

## Stack

- **Frontend**: React 18 + Vite + TypeScript + styled-components
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Banco**: PostgreSQL
- **Deploy**: Docker Compose

## Rodando o projeto

```bash
cp .env.example .env   # preencha DATABASE_URL, JWT_SECRET e GOOGLE_CLIENT_ID
docker compose up -d
```

Frontend em `http://localhost:5173`, API em `http://localhost:3001/api`. O backend roda as migrações e popula o banco automaticamente na primeira subida.

Guia completo de variáveis de ambiente, deploy e desenvolvimento local (sem Docker): **[docs/SETUP.md](docs/SETUP.md)**.

## Licença

Sem licença definida — todos os direitos reservados por padrão.
