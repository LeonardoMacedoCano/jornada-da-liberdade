import { prisma } from './lib/prisma'

export async function seedDatabase(): Promise<void> {
  console.log('🌱 Iniciando seed...')

  await prisma.appConfig.upsert({
    where: { key: 'minimum_wage' },
    update: {},
    create: { key: 'minimum_wage', value: '1412.00' },
  })
  await prisma.appConfig.upsert({
    where: { key: 'minimum_wage_updated_at' },
    update: {},
    create: { key: 'minimum_wage_updated_at', value: new Date().toISOString() },
  })

  // Conteúdo (nome, título, descrição, flavor text) mora em frontend/src/i18n/locales,
  // indexado por slug. Aqui só entram os dados estruturais/mecânicos do jogo.
  const phases = [
    { id: 0, slug: 'tutorial', color: 'gray', orderIndex: 0, achievementIcon: '👁️' },
    { id: 1, slug: 'quitacao', color: 'red', orderIndex: 1, achievementIcon: '⛓️' },
    { id: 2, slug: 'recruta', color: 'green', orderIndex: 2, achievementIcon: '🌿' },
    { id: 3, slug: 'soldado', color: 'blue', orderIndex: 3, achievementIcon: '⚔️' },
    { id: 4, slug: 'veterano', color: 'teal', orderIndex: 4, achievementIcon: '🛡️' },
    { id: 5, slug: 'elite', color: 'purple', orderIndex: 5, achievementIcon: '🦅' },
    { id: 6, slug: 'especialista', color: 'orange', orderIndex: 6, achievementIcon: '🔥' },
    { id: 7, slug: 'mestre', color: 'yellow', orderIndex: 7, achievementIcon: '👑' },
    { id: 8, slug: 'heroi', color: 'amber', orderIndex: 8, achievementIcon: '🏆' },
    { id: 9, slug: 'lenda', color: 'rose', orderIndex: 9, achievementIcon: '💎' },
  ]

  for (const phase of phases) {
    await prisma.phase.upsert({ where: { id: phase.id }, update: phase, create: phase })
  }

  const missions = [
    // ─── FASE 0: TUTORIAL ────────────────────────────────────────────────────
    {
      phaseId: 0, slug: 'mapear-dividas', orderIndex: 1,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 0, slug: 'registrar-gastos-30-dias', orderIndex: 2,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 0, slug: 'calcular-saldo-mensal', orderIndex: 3,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 0, slug: 'abrir-corretora', orderIndex: 4,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 0, slug: 'estudar-3-pilares', orderIndex: 5,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },

    // ─── FASE 1: QUITAÇÃO ─────────────────────────────────────────────────────
    {
      phaseId: 1, slug: 'criar-reserva-minima-1k', orderIndex: 1,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 1, slug: 'negociar-dividas-juros-altos', orderIndex: 2,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 1, slug: 'eliminar-rotativo-cartao', orderIndex: 3,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 1, slug: 'eliminar-cheque-especial', orderIndex: 4,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 1, slug: 'zerar-dividas-caras', orderIndex: 5,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },

    // ─── FASE 2: RECRUTA ──────────────────────────────────────────────────────
    {
      phaseId: 2, slug: 'reserva-emergencia-3-meses', orderIndex: 1,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 2, slug: 'meta-500', orderIndex: 2,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '500.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 2, slug: 'automatizar-aporte', orderIndex: 3,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 2, slug: 'dois-tipos-ativos', orderIndex: 4,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 2, slug: 'meta-5k', orderIndex: 5,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '5000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 2, slug: 'meta-10k', orderIndex: 6,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '10000.00', targetSmMultiple: null, requiredDurationDays: null,
    },

    // ─── FASE 3: SOLDADO ──────────────────────────────────────────────────────
    {
      phaseId: 3, slug: 'reserva-emergencia-6-meses', orderIndex: 1,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 3, slug: 'aumentar-aporte-10-porcento', orderIndex: 2,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 3, slug: 'tres-ativos-duas-categorias', orderIndex: 3,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 3, slug: 'meta-25k', orderIndex: 4,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '25000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 3, slug: 'documentar-estrategia-alocacao', orderIndex: 5,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 3, slug: 'meta-50k', orderIndex: 6,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '50000.00', targetSmMultiple: null, requiredDurationDays: null,
    },

    // ─── FASE 4: VETERANO ─────────────────────────────────────────────────────
    {
      phaseId: 4, slug: 'aporte-minimo-10-porcento-renda', orderIndex: 1,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 4, slug: 'cinco-ativos-analise-propria', orderIndex: 2,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 4, slug: 'meta-75k', orderIndex: 3,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '75000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 4, slug: 'aportes-12-meses-consecutivos', orderIndex: 4,
      missionType: 'habit', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: 365,
    },
    {
      phaseId: 4, slug: 'meta-100k', orderIndex: 5,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '100000.00', targetSmMultiple: null, requiredDurationDays: null,
    },

    // ─── FASE 5: ELITE ────────────────────────────────────────────────────────
    {
      phaseId: 5, slug: 'meta-150k', orderIndex: 1,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '150000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 5, slug: 'dois-ativos-internacionais', orderIndex: 2,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 5, slug: 'meta-200k', orderIndex: 3,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '200000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 5, slug: 'ponto-de-cruzamento', orderIndex: 4,
      missionType: 'crossover', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 5, slug: 'meta-300k', orderIndex: 5,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '300000.00', targetSmMultiple: null, requiredDurationDays: null,
    },

    // ─── FASE 6: ESPECIALISTA ─────────────────────────────────────────────────
    {
      phaseId: 6, slug: 'meta-400k', orderIndex: 1,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '400000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 6, slug: 'renda-passiva-2sm', orderIndex: 2,
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '2.0', requiredDurationDays: null,
    },
    {
      phaseId: 6, slug: 'oito-ativos-tres-categorias', orderIndex: 3,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 6, slug: 'meta-500k', orderIndex: 4,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '500000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 6, slug: 'renda-passiva-3sm', orderIndex: 5,
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '3.0', requiredDurationDays: null,
    },
    {
      phaseId: 6, slug: 'meta-600k', orderIndex: 6,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '600000.00', targetSmMultiple: null, requiredDurationDays: null,
    },

    // ─── FASE 7: MESTRE ───────────────────────────────────────────────────────
    {
      phaseId: 7, slug: 'renda-passiva-3-5sm', orderIndex: 1,
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '3.5', requiredDurationDays: null,
    },
    {
      phaseId: 7, slug: 'meta-750k', orderIndex: 2,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '750000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 7, slug: 'passiva-cobre-50-despesas', orderIndex: 3,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 7, slug: 'renda-passiva-4sm', orderIndex: 4,
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '4.0', requiredDurationDays: null,
    },
    {
      phaseId: 7, slug: 'meta-1M', orderIndex: 5,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '1000000.00', targetSmMultiple: null, requiredDurationDays: null,
    },

    // ─── FASE 8: HERÓI ────────────────────────────────────────────────────────
    {
      phaseId: 8, slug: 'renda-passiva-5sm', orderIndex: 1,
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '5.0', requiredDurationDays: null,
    },
    {
      phaseId: 8, slug: 'meta-1-5M', orderIndex: 2,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '1500000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 8, slug: 'passiva-cobre-100-despesas', orderIndex: 3,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 8, slug: 'portfolio-cresce-apos-saques-3m', orderIndex: 4,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 8, slug: 'renda-5sm-seis-meses-consecutivos', orderIndex: 5,
      missionType: 'habit', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: 180,
    },

    // ─── FASE 9: LENDA ────────────────────────────────────────────────────────
    {
      phaseId: 9, slug: 'renda-passiva-7sm', orderIndex: 1,
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '7.0', requiredDurationDays: null,
    },
    {
      phaseId: 9, slug: 'meta-2M', orderIndex: 2,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '2000000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 9, slug: 'portfolio-cresce-12-meses', orderIndex: 3,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 9, slug: 'renda-7sm-seis-meses-consecutivos', orderIndex: 4,
      missionType: 'habit', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: 180,
    },
    {
      phaseId: 9, slug: 'fire-confirmado', orderIndex: 5,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
  ]

  for (const mission of missions) {
    await prisma.mission.upsert({ where: { slug: mission.slug }, update: mission, create: mission })
  }

  console.log(`✅ Seed concluído! ${phases.length} fases e ${missions.length} missões.`)
}

if (require.main === module || process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
}
