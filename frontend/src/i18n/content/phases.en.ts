export interface PhaseContent {
  name: string
  title: string
  subtitle: string
  description: string
  flavorText: string
  achievementName: string
}

const phasesEn: Record<string, PhaseContent> = {
  'tutorial': {
    name: 'Tutorial',
    title: 'The Awakening',
    subtitle: 'From financial blindness to real awareness',
    achievementName: 'Eyes Open',
    description: 'It always starts the same way: realizing you don’t know where your money goes. Before you invest a single dollar, you need to see your financial reality with total clarity — debts, expenses, monthly surplus.',
    flavorText: 'Your money’s biggest enemy isn’t the market — it’s not knowing.',
  },
  'debt-freedom': {
    name: 'Debt Freedom',
    title: 'Breaking the Chains',
    subtitle: 'Paying off debt with interest above 1.5% a month',
    achievementName: 'Free of Chains',
    description: 'No investment on Earth beats credit card or overdraft interest. As long as that debt exists, you’re on a treadmill — moving, but going nowhere. This phase has no portfolio to build. It has chains to break.',
    flavorText: 'You can’t build wealth while paying 20%+ a year to someone else.',
  },
  'recruit': {
    name: 'Recruit',
    title: 'Planting the Seed',
    subtitle: '$1 to $10,000',
    achievementName: 'Seed Planted',
    description: 'The numbers are small. The returns barely show up. This phase is a test of character, not money. The habit built here is what carries every phase that follows.',
    flavorText: 'The seed no one sees is the one that becomes a forest.',
  },
  'soldier': {
    name: 'Soldier',
    title: 'Building the Base',
    subtitle: '$10,000 to $50,000',
    achievementName: 'Solid Foundation',
    description: 'The portfolio takes real shape. Returns start showing up in your notifications. A strategy begins to exist. Discipline is 90% of the work here — not stock picking, not market timing.',
    flavorText: 'A soldier doesn’t need luck. A soldier needs discipline.',
  },
  'veteran': {
    name: 'Veteran',
    title: 'The Big Climb',
    subtitle: '$50,000 to $100,000',
    achievementName: 'The 100k Club',
    description: 'The psychologically hardest phase. The numbers climb slowly and the feeling of "this will take forever" hits hard. But $100k is the real point of no return — compounding starts working visibly.',
    flavorText: 'Fewer than 3% of people ever get here. You’re going to be one of them.',
  },
  'elite': {
    name: 'Elite',
    title: 'Compounding Wakes Up',
    subtitle: '$100,000 to the Crossover Point',
    achievementName: 'Money at Work',
    description: 'The portfolio starts working for real. On good months, a single day’s gains can outrun your weekly contribution. The Crossover Point is getting close: when your monthly return overtakes your monthly contribution.',
    flavorText: 'The moment your money works harder than you do is the moment everything changes.',
  },
  'specialist': {
    name: 'Specialist',
    title: 'The Machine Comes Alive',
    subtitle: 'Crossover Point to $600,000',
    achievementName: 'Machine Running',
    description: 'The Crossover Point is behind you. Compounding is now visible every single month. Passive income starts meaning something real in your budget — it’s not just a number on a statement anymore.',
    flavorText: 'You don’t have to run anymore. The machine runs for you.',
  },
  'master': {
    name: 'Master',
    title: 'Semi-Retired',
    subtitle: '$600,000 to Your First Million',
    achievementName: 'Work Is Optional',
    description: 'Passive income already covers a meaningful chunk of your life. You can switch careers, go freelance, cut back your hours — or reinvest everything and push through the final phases faster. Work has lost its grip on you.',
    flavorText: 'Work stops being what you have to do and becomes what you choose to do.',
  },
  'hero': {
    name: 'Hero',
    title: 'Financial Independence',
    subtitle: '$1,000,000 to $2,000,000',
    achievementName: 'Financially Free',
    description: 'The portfolio covers 100% of your expenses. Work is 100% optional. Passive income keeps growing even while you live well. Confirmed over consecutive months — not a lucky market streak.',
    flavorText: 'You made it. Work is now a choice, not a necessity.',
  },
  'legend': {
    name: 'Legend',
    title: 'FIRE Achieved',
    subtitle: 'Final Boss — $2,000,000+',
    achievementName: 'Owner of Your Time',
    description: 'The game has flipped. You don’t just live off the returns — the portfolio keeps GROWING even while you spend comfortably. Wealth sustains itself. Total sovereignty.',
    flavorText: 'The game never ends — but now you choose what to play.',
  },
}

export default phasesEn
