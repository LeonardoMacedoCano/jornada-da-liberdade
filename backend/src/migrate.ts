import { prisma } from './lib/prisma'

export async function runMigrations(): Promise<void> {
  console.log('🔄 Verificando tabelas no schema jornadaliberdade...')

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "AppConfig" (
      "key"       TEXT NOT NULL PRIMARY KEY,
      "value"     TEXT NOT NULL,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id"                   TEXT NOT NULL PRIMARY KEY,
      "name"                 TEXT NOT NULL,
      "email"                TEXT NOT NULL,
      "passwordHash"         TEXT NOT NULL,
      "username"             TEXT NOT NULL,
      "avatarType"           TEXT NOT NULL DEFAULT 'warrior',
      "sharePublicProfile"   BOOLEAN NOT NULL DEFAULT TRUE,
      "showFinancialValues"  BOOLEAN NOT NULL DEFAULT FALSE,
      "createdAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "User_email_key" UNIQUE ("email"),
      CONSTRAINT "User_username_key" UNIQUE ("username")
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Phase" (
      "id"              INTEGER NOT NULL PRIMARY KEY,
      "slug"            TEXT NOT NULL,
      "name"            TEXT NOT NULL,
      "title"           TEXT NOT NULL,
      "subtitle"        TEXT NOT NULL,
      "description"     TEXT NOT NULL,
      "flavorText"      TEXT NOT NULL,
      "orderIndex"      INTEGER NOT NULL,
      "achievementName" TEXT NOT NULL,
      "achievementIcon" TEXT NOT NULL,
      "color"           TEXT NOT NULL,
      CONSTRAINT "Phase_slug_key" UNIQUE ("slug")
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Mission" (
      "id"                   SERIAL NOT NULL PRIMARY KEY,
      "phaseId"              INTEGER NOT NULL,
      "slug"                 TEXT NOT NULL,
      "title"                TEXT NOT NULL,
      "description"          TEXT NOT NULL,
      "missionType"          TEXT NOT NULL,
      "targetValue"          DECIMAL(15,2),
      "targetSmMultiple"     DECIMAL(5,2),
      "isRequiredForPhase"   BOOLEAN NOT NULL DEFAULT TRUE,
      "orderIndex"           INTEGER NOT NULL,
      "requiredDurationDays" INTEGER,
      CONSTRAINT "Mission_slug_key" UNIQUE ("slug"),
      CONSTRAINT "Mission_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase"("id")
    )
  `)

  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Mission" ADD COLUMN IF NOT EXISTS "requiredDurationDays" INTEGER
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "UserProgress" (
      "id"                   TEXT NOT NULL PRIMARY KEY,
      "userId"               TEXT NOT NULL,
      "currentPhaseId"       INTEGER NOT NULL DEFAULT 0,
      "investedAmount"       DECIMAL(15,2) NOT NULL DEFAULT 0,
      "monthlyPassiveIncome" DECIMAL(10,2) NOT NULL DEFAULT 0,
      "monthlyContribution"  DECIMAL(10,2) NOT NULL DEFAULT 0,
      "annualReturnRate"     DECIMAL(5,2) NOT NULL DEFAULT 11,
      "updatedAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "UserProgress_userId_key" UNIQUE ("userId"),
      CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "UserMissionProgress" (
      "id"          TEXT NOT NULL PRIMARY KEY,
      "userId"      TEXT NOT NULL,
      "missionId"   INTEGER NOT NULL,
      "isCompleted" BOOLEAN NOT NULL DEFAULT FALSE,
      "completedAt" TIMESTAMP(3),
      "startedAt"   TIMESTAMP(3),
      CONSTRAINT "UserMissionProgress_userId_missionId_key" UNIQUE ("userId", "missionId"),
      CONSTRAINT "UserMissionProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
      CONSTRAINT "UserMissionProgress_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id")
    )
  `)

  await prisma.$executeRawUnsafe(`
    ALTER TABLE "UserMissionProgress" ADD COLUMN IF NOT EXISTS "startedAt" TIMESTAMP(3)
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "UserPhaseHistory" (
      "id"                         TEXT NOT NULL PRIMARY KEY,
      "userId"                     TEXT NOT NULL,
      "phaseId"                    INTEGER NOT NULL,
      "completedAt"                TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "portfolioValueAtCompletion" DECIMAL(15,2),
      CONSTRAINT "UserPhaseHistory_userId_phaseId_key" UNIQUE ("userId", "phaseId"),
      CONSTRAINT "UserPhaseHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
      CONSTRAINT "UserPhaseHistory_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase"("id")
    )
  `)

  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'UserPhaseHistory_userId_phaseId_key'
      ) THEN
        ALTER TABLE "UserPhaseHistory" ADD CONSTRAINT "UserPhaseHistory_userId_phaseId_key" UNIQUE ("userId", "phaseId");
      END IF;
    END $$
  `)

  console.log('✅ Tabelas verificadas/criadas com sucesso.')
}
