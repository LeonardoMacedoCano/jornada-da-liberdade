import { prisma } from './lib/prisma'

export async function seedDatabase(): Promise<void> {
  console.log('🌱 Starting seed...')

  // Content (name, title, description, flavor text) lives in frontend/src/i18n/content,
  // indexed by slug. Only structural/mechanical game data goes here.
  const phases = [
    { id: 0, slug: 'tutorial', color: 'gray', orderIndex: 0, achievementIcon: '👁️' },
    { id: 1, slug: 'debt-freedom', color: 'red', orderIndex: 1, achievementIcon: '⛓️' },
    { id: 2, slug: 'recruit', color: 'green', orderIndex: 2, achievementIcon: '🌿' },
    { id: 3, slug: 'soldier', color: 'blue', orderIndex: 3, achievementIcon: '⚔️' },
    { id: 4, slug: 'veteran', color: 'teal', orderIndex: 4, achievementIcon: '🛡️' },
    { id: 5, slug: 'elite', color: 'purple', orderIndex: 5, achievementIcon: '🦅' },
    { id: 6, slug: 'specialist', color: 'orange', orderIndex: 6, achievementIcon: '🔥' },
    { id: 7, slug: 'master', color: 'yellow', orderIndex: 7, achievementIcon: '👑' },
    { id: 8, slug: 'hero', color: 'amber', orderIndex: 8, achievementIcon: '🏆' },
    { id: 9, slug: 'legend', color: 'rose', orderIndex: 9, achievementIcon: '💎' },
  ]

  for (const phase of phases) {
    await prisma.phase.upsert({ where: { id: phase.id }, update: phase, create: phase })
  }

  const missions = [
    // ─── PHASE 0: TUTORIAL ───────────────────────────────────────────────────
    {
      phaseId: 0, slug: 'map-debts', orderIndex: 1,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 0, slug: 'track-expenses-30-days', orderIndex: 2,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 0, slug: 'calculate-monthly-balance', orderIndex: 3,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 0, slug: 'open-brokerage-account', orderIndex: 4,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 0, slug: 'learn-3-pillars', orderIndex: 5,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },

    // ─── PHASE 1: DEBT FREEDOM ────────────────────────────────────────────────
    {
      phaseId: 1, slug: 'build-emergency-fund-1k', orderIndex: 1,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 1, slug: 'negotiate-high-interest-debt', orderIndex: 2,
      missionType: 'behavioral', isRequiredForPhase: false,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 1, slug: 'eliminate-credit-card-revolving', orderIndex: 3,
      missionType: 'behavioral', isRequiredForPhase: false,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 1, slug: 'eliminate-overdraft-debt', orderIndex: 4,
      missionType: 'behavioral', isRequiredForPhase: false,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 1, slug: 'payoff-all-expensive-debt', orderIndex: 5,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },

    // ─── PHASE 2: RECRUIT ─────────────────────────────────────────────────────
    {
      phaseId: 2, slug: 'emergency-fund-3-months', orderIndex: 1,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 2, slug: 'goal-500', orderIndex: 2,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '500.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 2, slug: 'automate-contribution', orderIndex: 3,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 2, slug: 'two-asset-types', orderIndex: 4,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 2, slug: 'goal-5k', orderIndex: 5,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '5000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 2, slug: 'goal-10k', orderIndex: 6,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '10000.00', targetSmMultiple: null, requiredDurationDays: null,
    },

    // ─── PHASE 3: SOLDIER ─────────────────────────────────────────────────────
    {
      phaseId: 3, slug: 'emergency-fund-6-months', orderIndex: 1,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 3, slug: 'increase-contribution-10-percent', orderIndex: 2,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 3, slug: 'three-assets-two-categories', orderIndex: 3,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 3, slug: 'goal-25k', orderIndex: 4,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '25000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 3, slug: 'document-allocation-strategy', orderIndex: 5,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 3, slug: 'goal-50k', orderIndex: 6,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '50000.00', targetSmMultiple: null, requiredDurationDays: null,
    },

    // ─── PHASE 4: VETERAN ─────────────────────────────────────────────────────
    {
      phaseId: 4, slug: 'minimum-contribution-10-percent-income', orderIndex: 1,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 4, slug: 'five-assets-own-analysis', orderIndex: 2,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 4, slug: 'goal-75k', orderIndex: 3,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '75000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 4, slug: 'contributions-12-consecutive-months', orderIndex: 4,
      missionType: 'habit', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: 365,
    },
    {
      phaseId: 4, slug: 'goal-100k', orderIndex: 5,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '100000.00', targetSmMultiple: null, requiredDurationDays: null,
    },

    // ─── PHASE 5: ELITE ───────────────────────────────────────────────────────
    {
      phaseId: 5, slug: 'goal-150k', orderIndex: 1,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '150000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 5, slug: 'two-international-assets', orderIndex: 2,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 5, slug: 'goal-200k', orderIndex: 3,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '200000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 5, slug: 'crossover-point', orderIndex: 4,
      missionType: 'crossover', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 5, slug: 'goal-300k', orderIndex: 5,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '300000.00', targetSmMultiple: null, requiredDurationDays: null,
    },

    // ─── PHASE 6: SPECIALIST ──────────────────────────────────────────────────
    {
      phaseId: 6, slug: 'goal-400k', orderIndex: 1,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '400000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 6, slug: 'passive-income-2mw', orderIndex: 2,
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '2.0', requiredDurationDays: null,
    },
    {
      phaseId: 6, slug: 'eight-assets-three-categories', orderIndex: 3,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 6, slug: 'goal-500k', orderIndex: 4,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '500000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 6, slug: 'passive-income-3mw', orderIndex: 5,
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '3.0', requiredDurationDays: null,
    },
    {
      phaseId: 6, slug: 'goal-600k', orderIndex: 6,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '600000.00', targetSmMultiple: null, requiredDurationDays: null,
    },

    // ─── PHASE 7: MASTER ──────────────────────────────────────────────────────
    {
      phaseId: 7, slug: 'passive-income-3-5mw', orderIndex: 1,
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '3.5', requiredDurationDays: null,
    },
    {
      phaseId: 7, slug: 'goal-750k', orderIndex: 2,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '750000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 7, slug: 'passive-covers-50-expenses', orderIndex: 3,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 7, slug: 'passive-income-4mw', orderIndex: 4,
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '4.0', requiredDurationDays: null,
    },
    {
      phaseId: 7, slug: 'goal-1m', orderIndex: 5,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '1000000.00', targetSmMultiple: null, requiredDurationDays: null,
    },

    // ─── PHASE 8: HERO ────────────────────────────────────────────────────────
    {
      phaseId: 8, slug: 'passive-income-5mw', orderIndex: 1,
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '5.0', requiredDurationDays: null,
    },
    {
      phaseId: 8, slug: 'goal-1-5m', orderIndex: 2,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '1500000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 8, slug: 'passive-covers-100-expenses', orderIndex: 3,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 8, slug: 'portfolio-grows-after-withdrawals-3m', orderIndex: 4,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 8, slug: 'passive-income-5mw-six-consecutive-months', orderIndex: 5,
      missionType: 'habit', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: 180,
    },

    // ─── PHASE 9: LEGEND ──────────────────────────────────────────────────────
    {
      phaseId: 9, slug: 'passive-income-7mw', orderIndex: 1,
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '7.0', requiredDurationDays: null,
    },
    {
      phaseId: 9, slug: 'goal-2m', orderIndex: 2,
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '2000000.00', targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 9, slug: 'portfolio-grows-12-months', orderIndex: 3,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
    {
      phaseId: 9, slug: 'passive-income-7mw-six-consecutive-months', orderIndex: 4,
      missionType: 'habit', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: 180,
    },
    {
      phaseId: 9, slug: 'fire-confirmed', orderIndex: 5,
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
    },
  ]

  for (const mission of missions) {
    await prisma.mission.upsert({ where: { slug: mission.slug }, update: mission, create: mission })
  }

  console.log(`✅ Seed complete! ${phases.length} phases and ${missions.length} missions.`)
}

if (require.main === module || process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
}
