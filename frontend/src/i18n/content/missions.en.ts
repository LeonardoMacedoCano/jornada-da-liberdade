export interface MissionContent {
  title: string
  description: string
}

const missionsEn: Record<string, MissionContent> = {
  'mapear-dividas': {
    title: 'Map out every existing debt',
    description: 'List every active debt on a spreadsheet or paper: creditor name, current balance, monthly interest rate, and payment amount. Without this clarity, any financial strategy is flying blind.',
  },
  'registrar-gastos-30-dias': {
    title: 'Track every expense for 30 days',
    description: 'For one full month, write down every expense, no matter how small. Use an app (Mint, YNAB, Copilot), a spreadsheet, or a notebook. You can’t cut what you can’t see — and what you can’t see always grows.',
  },
  'calcular-saldo-mensal': {
    title: 'Calculate your available monthly balance',
    description: 'Based on your tracked expenses: subtract total spending from your monthly take-home pay. That number — positive or negative — is your real starting point. If it’s negative, you’re racking up debt every month without realizing it.',
  },
  'abrir-corretora': {
    title: 'Open an account with a brokerage or high-yield bank',
    description: 'Create an account with a reputable brokerage (Fidelity, Vanguard, Schwab) or a bank/app with automatic yield (Ally, Marcus, SoFi). You don’t need to deposit yet — just get the platform ready and explore what’s available.',
  },
  'estudar-3-pilares': {
    title: 'Learn the 3 pillars of investing',
    description: 'Understand the basics of: Fixed Income (CDs, Treasury bills, bonds), Equities (stocks, ETFs, REITs), and Emergency Fund (the difference between saving and investing). Without this minimum, you invest on impulse — not strategy.',
  },
  'criar-reserva-minima-1k': {
    title: 'Build a minimum $1,000 emergency fund',
    description: 'Before attacking your debt, set aside $1,000 in an account with daily liquidity (high-yield savings account or money market fund). This exists so an unexpected expense doesn’t push you back onto credit card debt while you’re paying it off.',
  },
  'negociar-dividas-juros-altos': {
    title: 'Negotiate or refinance debt above 1.5% a month',
    description: 'For every debt above 1.5% a month (~18% APR): try negotiating directly with the creditor (nonprofit credit counseling agencies often get real discounts), or replace it with a lower-interest personal loan, credit union loan, or balance-transfer card. Even a 0.5% monthly difference adds up to hundreds of dollars saved.',
  },
  'eliminar-rotativo-cartao': {
    title: 'Eliminate revolving credit card debt for good',
    description: 'Pay off your full statement balance and set an unbreakable rule: never carry a balance again. Revolving credit card debt runs 20%–29% APR — no investment on the planet beats that. If needed, cut up the card until you have the discipline to use it only as a payment method.',
  },
  'eliminar-cheque-especial': {
    title: 'Eliminate overdraft debt and expensive personal loans',
    description: 'Pay off any overdraft balance and personal loans with interest above 1.5% a month. These are silent traps: they charge interest even when you "barely use" them. If you can’t pay it off all at once, build an aggressive plan — prioritize this debt above any investment beyond your minimum emergency fund.',
  },
  'zerar-dividas-caras': {
    title: 'Pay off every debt with interest above 1.5% a month',
    description: 'Final milestone of this phase: zero debt left with interest above 1.5% a month. Mortgages, auto loans, or student loans below that rate can stay — they’re "healthy debt." From here on, every dollar you invest works fully in your favor.',
  },
  'reserva-emergencia-3-meses': {
    title: 'Build a 3-month emergency fund',
    description: 'Expand your fund to cover 3 full months of average expenses, in an account with daily liquidity (high-yield savings or money market fund). Without this, any surprise — illness, layoff, car trouble — forces you to sell investments at the worst possible time.',
  },
  'meta-500': {
    title: 'Reach $500 invested',
    description: 'Your first real contact with the market. Could be a money market fund, a CD, or an ETF like VOO. The goal isn’t the return — it’s breaking the inertia and feeling your money grow outside your checking account.',
  },
  'automatizar-aporte': {
    title: 'Automate a fixed monthly contribution (pay yourself first)',
    description: 'Set a fixed amount — even if it’s just $50 — and schedule an automatic transfer for the day after payday. The trick with automatic contributions is that the money disappears before you think about spending it. That turns investing into an involuntary habit.',
  },
  'dois-tipos-ativos': {
    title: 'Hold at least 2 different types of assets',
    description: 'Combine at least two distinct categories: fixed income (CDs, Treasury bills, bonds) and equities (a stock, ETF, or REIT). Diversifying from the start builds the right habit of not concentrating risk in a single asset or asset class.',
  },
  'meta-5k': {
    title: 'Reach $5,000 invested',
    description: 'The portfolio starts taking shape. At $5,000 and 11% a year, the estimated monthly return is ~$46 — modest, but real. The habit is planted, and the next milestone is close.',
  },
  'meta-10k': {
    title: 'Reach $10,000 invested',
    description: 'A historic milestone: you’ve joined the select group of people with real invested net worth. At $10,000 and 11% a year, the portfolio generates ~$92/month — almost a utility bill paid by your own money. Compounding has begun.',
  },
  'reserva-emergencia-6-meses': {
    title: 'Build a 6-month emergency fund',
    description: 'Expand your fund to cover 6 full months of expenses with daily liquidity. This is the recommended standard for anyone with variable income or dependents. From here on, you invest with conviction — no fear of needing to cash out during a downturn.',
  },
  'aumentar-aporte-10-porcento': {
    title: 'Increase your monthly contribution by at least 10%',
    description: 'If you were contributing $500/month, bump it to at least $550. Small annual increases have a huge long-term impact: raising your contribution 10% a year for 10 years more than doubles the amount invested. Revisit this every time your income goes up.',
  },
  'tres-ativos-duas-categorias': {
    title: 'Hold at least 3 assets across 2 distinct categories',
    description: 'E.g.: 2 different stocks + 1 CD, or 1 ETF + 1 REIT + 1 Treasury bond. Diversifying across at least 2 categories protects your portfolio from a concentrated drop in a single sector or asset type.',
  },
  'meta-25k': {
    title: 'Reach $25,000 invested',
    description: 'Halfway to $50k. At $25,000 and 11% a year, the portfolio generates ~$229/month — it’s starting to show up on your statement in a noticeable way.',
  },
  'documentar-estrategia-alocacao': {
    title: 'Document your allocation strategy by category',
    description: 'Write down, in a spreadsheet or document, what percentage you want in each category: e.g. 40% fixed income, 40% domestic stocks, 20% international. Having this written and reviewed yearly prevents emotional decisions during downturns — you follow the plan, not the market’s mood.',
  },
  'meta-50k': {
    title: 'Reach $50,000 invested',
    description: 'The base is built. $50k invested at 11% a year generates ~$458/month — practically a bonus paycheck generated passively every couple of months. You’re a disciplined soldier.',
  },
  'aporte-minimo-10-porcento-renda': {
    title: 'Contribute at least 10% of your gross income monthly',
    description: '10% is the historical minimum for solid long-term accumulation. If your gross income is $4,000, that means $400/month. Below 10%, returns barely outpace inflation over 20+ years. Above 20%, the journey accelerates significantly.',
  },
  'cinco-ativos-analise-propria': {
    title: 'Hold at least 5 assets with documented analysis',
    description: 'For every asset in your portfolio: write down why you bought it (your investment thesis), the main risks, and under what scenario you’d sell. This turns you from a speculator into an investor — and keeps you from panic-selling when you remember why you’re holding it.',
  },
  'meta-75k': {
    title: 'Reach $75,000 invested',
    description: 'Three-quarters of the way to $100k. At $75k and 11% a year, the portfolio generates ~$688/month. The acceleration is close — every contribution matters more now because compounding already feeds off a bigger base.',
  },
  'aportes-12-meses-consecutivos': {
    title: 'Keep contributing monthly for 12 consecutive months',
    description: 'A full year of contributions with no interruption: no month skipped because "the market is down," no pause for a "plannable emergency," no exception for a "once-in-a-lifetime opportunity." Twelve months of consistency proves the habit is real — not just a burst of excitement.',
  },
  'meta-100k': {
    title: 'Reach $100,000 invested — The 100k Club',
    description: 'The most symbolic milestone in the game. Fewer than 3% of people ever get here. At $100k and 11% a year, the portfolio generates ~$917/month — more than a full month’s minimum wage, generated passively, without working a single day.',
  },
  'meta-150k': {
    title: 'Reach $150,000 invested',
    description: 'The portfolio has critical mass. At $150k and 11% a year, the estimated monthly return is ~$1,375. On good market months, a single day’s gain can outrun your entire weekly contribution.',
  },
  'dois-ativos-internacionais': {
    title: 'Hold at least 2 international assets in your portfolio',
    description: 'Add international index funds or ETFs (like VXUS or a total international fund) to your portfolio. Geographic diversification protects you from downturns localized to the US economy — when the dollar weakens, international assets cushion part of the loss.',
  },
  'meta-200k': {
    title: 'Reach $200,000 invested',
    description: '$200k at 11% a year generates ~$1,833/month. Your monthly portfolio return already exceeds a full month’s minimum wage. Two-thirds of the way to the Crossover Point.',
  },
  'ponto-de-cruzamento': {
    title: 'Crossover Point: monthly return ≥ monthly contribution',
    description: 'Your portfolio’s estimated monthly return (net worth × annual rate ÷ 12) has overtaken your monthly contribution. That means your money is now accumulating faster than you are. From here on, your net worth keeps growing even without contributing — you keep contributing to accelerate it further.',
  },
  'meta-300k': {
    title: 'Reach $300,000 invested',
    description: '$300k at 11% a year generates ~$2,750/month — practically 2 months of minimum wage generated by your net worth. The Crossover Point is behind you now.',
  },
  'meta-400k': {
    title: 'Reach $400,000 invested',
    description: '$400k at 11% a year generates ~$3,667/month. The portfolio works harder than most full-time jobs. Compounding is now felt in a concrete way every month.',
  },
  'renda-passiva-2sm': {
    title: 'Monthly passive income ≥ 2× minimum wage',
    description: 'Passive income equal to 2 months of minimum wage starts having real meaning in your budget — it could cover rent, a car payment, and basic groceries in many parts of the country. Calculated automatically based on your financial data and the current minimum wage.',
  },
  'oito-ativos-tres-categorias': {
    title: 'Hold at least 8 assets across 3 distinct categories',
    description: 'A mature portfolio: at least 8 distinct assets spread across 3 different categories — e.g. fixed income (CDs, Treasury bonds), domestic equities (stocks, ETFs, REITs), and international (global index funds). This diversification reduces the portfolio’s non-systematic risk.',
  },
  'meta-500k': {
    title: 'Reach $500,000 invested — Half a Million',
    description: 'Half a million. $500k at 11% a year generates ~$4,583/month. You’re now among the top 0.5% in terms of invested net worth.',
  },
  'renda-passiva-3sm': {
    title: 'Monthly passive income ≥ 3× minimum wage',
    description: 'Equal to 3 months of minimum wage generated by your net worth every month. This level lets you live comfortably in most mid-sized US cities, covering rent, food, transportation, and entertainment — all sustained by your returns.',
  },
  'meta-600k': {
    title: 'Reach $600,000 invested',
    description: '$600k at 11% a year generates ~$5,500/month. The machine is running at full capacity. The next phase is the road to your first million.',
  },
  'renda-passiva-3-5sm': {
    title: 'Monthly passive income ≥ 3.5× minimum wage',
    description: 'Equal to 3.5 months of minimum wage generated by your net worth. Passive income now covers a basic-to-comfortable lifestyle in most of the country. You can cut back your hours without hurting your quality of life.',
  },
  'meta-750k': {
    title: 'Reach $750,000 invested',
    description: '75% of the way to your first million. $750k at 11% a year generates ~$6,875/month — more than 4× minimum wage in monthly returns. The final push is close.',
  },
  'passiva-cobre-50-despesas': {
    title: 'Passive income covers at least 50% of monthly expenses',
    description: 'Calculate it: add up all the real passive income received over the last 3 months and compare it to your total expenses. If passive income already covers more than half your bills, you only need work to cover the other half. Work has lost its grip on you.',
  },
  'renda-passiva-4sm': {
    title: 'Monthly passive income ≥ 4× minimum wage',
    description: 'Equal to 4 months of minimum wage generated by your net worth. At this level you can go part-time, switch to a more meaningful career, or freelance — with zero financial pressure to take a bad job.',
  },
  'meta-1M': {
    title: 'Reach $1,000,000 invested — Your First Million',
    description: 'Your first million. $1M at 11% a year generates ~$9,167/month — more than 6× minimum wage, passively, every month. Fewer than 1% of people ever get here. It wasn’t luck — it was discipline, compounded over years.',
  },
  'renda-passiva-5sm': {
    title: 'Monthly passive income ≥ 5× minimum wage',
    description: 'Equal to 5 months of minimum wage generated by your net worth. A comfortable lifestyle almost anywhere in the country — covering housing, food, healthcare, transportation, and entertainment — fully sustained by your returns.',
  },
  'meta-1-5M': {
    title: 'Reach $1,500,000 invested',
    description: '$1.5M at 11% a year generates ~$13,750/month. The portfolio accumulates more per month than most people earn in salary. You’re in the final stretch of the journey.',
  },
  'passiva-cobre-100-despesas': {
    title: 'Passive income covers 100% of expenses for 3 consecutive months',
    description: 'For 3 months in a row, add up all the passive income received (dividends, interest, returns) and confirm it covers 100% of your spending without touching your paycheck. Work has become optional from a financial standpoint.',
  },
  'portfolio-cresce-apos-saques-3m': {
    title: 'Portfolio still grows after withdrawing passive income for 3 months',
    description: 'For 3 months in a row: withdraw all the passive income generated for personal use, and confirm your total portfolio value at the end of each month is still higher than it was at the start. This confirms you’re in perpetuation mode — your net worth grows even while you spend from it.',
  },
  'renda-5sm-seis-meses-consecutivos': {
    title: 'Keep passive income ≥ 5× minimum wage for 6 consecutive months',
    description: 'Six months in a row with passive income ≥ 5× minimum wage. This rules out the chance it was just a good market stretch — it’s your net worth’s new, permanent baseline.',
  },
  'renda-passiva-7sm': {
    title: 'Monthly passive income ≥ 7× minimum wage',
    description: 'Equal to 7 months of minimum wage generated by your net worth. An excellent lifestyle anywhere in the country, with plenty of room to reinvest part of your returns and accelerate your net worth even further.',
  },
  'meta-2M': {
    title: 'Reach $2,000,000 invested',
    description: 'Two million. $2M at 11% a year generates ~$18,333/month. Your net worth generates more per month than the annual income of most people. Your wealth is perpetual: you spend comfortably and the capital still grows.',
  },
  'portfolio-cresce-12-meses': {
    title: 'Portfolio grows after withdrawals for 12 consecutive months',
    description: 'A full year: you lived entirely off your returns, and your total portfolio value at year’s end is still higher than it was at the start. Your wealth sustains itself — it’s no longer mathematically possible to run out within a reasonable lifestyle.',
  },
  'renda-7sm-seis-meses-consecutivos': {
    title: 'Keep passive income ≥ 7× minimum wage for 6 consecutive months',
    description: 'Six consecutive months with passive income ≥ 7× minimum wage. That high income is the new floor — not a lucky market exception.',
  },
  'fire-confirmado': {
    title: 'FIRE confirmed: no more working out of financial necessity',
    description: 'The final, unbreakable milestone: you could stop working today, live off your returns for the rest of your life without touching your principal, and still leave an inheritance. The final boss is defeated. Total sovereignty over your time, your work, and your life.',
  },
}

export default missionsEn
