import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(__dirname, '../../.env') })

import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { prisma } from './lib/prisma'
import { runMigrations } from './migrate'
import { router } from './routes'

const app = express()
const PORT = process.env.PORT || process.env.BACKEND_PORT || 3001

async function runSeedIfEmpty(): Promise<void> {
  const phaseCount = await prisma.phase.count()
  if (phaseCount > 0) {
    console.log(`ℹ️  Banco já populado (${phaseCount} fases). Seed ignorado.`)
    return
  }

  console.log('🌱 Populando banco com fases e missões...')
  const { seedDatabase } = await import('./seed')
  await seedDatabase()
}

async function main(): Promise<void> {
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET não configurado. Defina a variável de ambiente antes de iniciar.')
    process.exit(1)
  }

  await runMigrations()
  await runSeedIfEmpty()

  const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',')
  app.use(cors({ origin: corsOrigins, credentials: true }))
  app.use(express.json())
  app.use('/api', router)
  app.get('/health', (_req, res) => res.json({ status: 'ok' }))

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  })

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
