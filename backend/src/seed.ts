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

  const phases = [
    {
      id: 0, slug: 'tutorial', name: 'Tutorial', color: 'gray', orderIndex: 0,
      title: 'O Despertar',
      subtitle: 'Da ignorância financeira à consciência real',
      achievementName: 'Olhos Abertos', achievementIcon: '👁️',
      description: 'O início é sempre o mesmo: descobrir que você não sabe onde o dinheiro vai. Antes de investir qualquer centavo, você precisa enxergar sua realidade financeira com clareza total — dívidas, gastos, sobra mensal.',
      flavorText: 'O maior inimigo do seu dinheiro não é o mercado — é o desconhecimento.',
    },
    {
      id: 1, slug: 'quitacao', name: 'Quitação', color: 'red', orderIndex: 1,
      title: 'Quebrando as Correntes',
      subtitle: 'Zerando dívidas com juros acima de 1,5% ao mês',
      achievementName: 'Livre das Correntes', achievementIcon: '⛓️',
      description: 'Nenhum investimento no mundo vence juros de cartão rotativo ou cheque especial. Enquanto essas dívidas existirem, você está numa esteira — se movendo, mas sem sair do lugar. Esta fase não tem portfólio a construir. Tem correntes a quebrar.',
      flavorText: 'Você não pode construir riqueza enquanto paga 200% ao ano para alguém.',
    },
    {
      id: 2, slug: 'recruta', name: 'Recruta', color: 'green', orderIndex: 2,
      title: 'Plantando a Semente',
      subtitle: 'De R$ 1 a R$ 10.000',
      achievementName: 'Semente Plantada', achievementIcon: '🌿',
      description: 'Os números são pequenos. Os rendimentos mal aparecem. Essa fase é um teste de caráter, não de dinheiro. O hábito que nasce aqui é o que sustenta todas as fases seguintes.',
      flavorText: 'A semente que ninguém vê é a que vira floresta.',
    },
    {
      id: 3, slug: 'soldado', name: 'Soldado', color: 'blue', orderIndex: 3,
      title: 'Construindo a Base',
      subtitle: 'De R$ 10.000 a R$ 50.000',
      achievementName: 'Fundação Sólida', achievementIcon: '⚔️',
      description: 'O portfólio tem forma real. Os rendimentos aparecem nas notificações. A estratégia começa a existir. Disciplina é 90% do trabalho aqui — não análise de ativo, não timing de mercado.',
      flavorText: 'Um soldado não precisa de sorte. Precisa de disciplina.',
    },
    {
      id: 4, slug: 'veterano', name: 'Veterano', color: 'teal', orderIndex: 4,
      title: 'A Grande Escalada',
      subtitle: 'De R$ 50.000 a R$ 100.000',
      achievementName: 'Clube dos 100k', achievementIcon: '🛡️',
      description: 'A fase psicologicamente mais difícil. Os números sobem devagar e a sensação de "vai levar uma vida" bate forte. Mas R$ 100k é o verdadeiro ponto de não retorno — o compounding começa a trabalhar visível.',
      flavorText: 'Menos de 3% dos brasileiros chegam aqui. Você vai ser um deles.',
    },
    {
      id: 5, slug: 'elite', name: 'Elite', color: 'purple', orderIndex: 5,
      title: 'O Compounding Acorda',
      subtitle: 'De R$ 100.000 ao Ponto de Cruzamento',
      achievementName: 'O Dinheiro Trabalha', achievementIcon: '🦅',
      description: 'O portfólio começa a trabalhar de verdade. Em meses bons, a valorização de um dia supera o aporte semanal. O Ponto de Cruzamento se aproxima: quando o retorno mensal superar o aporte mensal.',
      flavorText: 'O momento em que o dinheiro trabalha mais do que você é o momento que muda tudo.',
    },
    {
      id: 6, slug: 'especialista', name: 'Especialista', color: 'orange', orderIndex: 6,
      title: 'A Máquina Ganha Vida',
      subtitle: 'Do Ponto de Cruzamento a R$ 600.000',
      achievementName: 'Máquina Ativa', achievementIcon: '🔥',
      description: 'O Ponto de Cruzamento ficou para trás. O compounding agora é visível todo mês. A renda passiva começa a ter significado real no seu orçamento — não é mais só número no extrato.',
      flavorText: 'Você não precisa mais correr. A máquina já corre por você.',
    },
    {
      id: 7, slug: 'mestre', name: 'Mestre', color: 'yellow', orderIndex: 7,
      title: 'Pré-Aposentado',
      subtitle: 'De R$ 600.000 ao Primeiro Milhão',
      achievementName: 'Trabalho é Opção', achievementIcon: '👑',
      description: 'A renda passiva já cobre uma parte considerável da vida. Você pode mudar de área, virar freelancer, reduzir jornada — ou reinvestir tudo e acelerar as fases finais. O trabalho perdeu o poder de te prender.',
      flavorText: 'Trabalho deixa de ser o que você tem que fazer e vira o que você escolhe fazer.',
    },
    {
      id: 8, slug: 'heroi', name: 'Herói', color: 'amber', orderIndex: 8,
      title: 'Independência Financeira',
      subtitle: 'De R$ 1.000.000 a R$ 2.000.000',
      achievementName: 'Financeiramente Livre', achievementIcon: '🏆',
      description: 'O portfólio cobre 100% das despesas. Trabalho é 100% opcional. A renda passiva cresce mesmo enquanto você vive bem. Confirmado por meses consecutivos — não foi sorte de mercado.',
      flavorText: 'Você chegou. Trabalho é agora uma escolha, não uma necessidade.',
    },
    {
      id: 9, slug: 'lenda', name: 'Lenda', color: 'rose', orderIndex: 9,
      title: 'FIRE Completo',
      subtitle: 'Boss Final — R$ 2.000.000+',
      achievementName: 'Dono do Tempo', achievementIcon: '💎',
      description: 'O jogo virou. Você não só vive dos rendimentos — o portfólio ainda CRESCE mesmo com você gastando confortavelmente. A riqueza se perpetua sozinha. Soberania total.',
      flavorText: 'O jogo não acaba — mas agora você escolhe o que jogar.',
    },
  ]

  for (const phase of phases) {
    await prisma.phase.upsert({ where: { id: phase.id }, update: phase, create: phase })
  }

  const missions = [
    // ─── FASE 0: TUTORIAL ────────────────────────────────────────────────────
    {
      phaseId: 0, slug: 'mapear-dividas', orderIndex: 1,
      title: 'Mapear todas as dívidas existentes',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Liste todas as dívidas ativas em uma planilha ou papel: nome do credor, saldo devedor atual, taxa de juros mensal e valor da parcela. Sem essa clareza, qualquer estratégia financeira é cega.',
    },
    {
      phaseId: 0, slug: 'registrar-gastos-30-dias', orderIndex: 2,
      title: 'Registrar todos os gastos por 30 dias',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Durante 1 mês completo, anote cada despesa por menor que seja. Use um app (Mobills, Organizze), planilha ou caderno. Você não pode cortar o que não enxerga — e o que não enxerga sempre cresce.',
    },
    {
      phaseId: 0, slug: 'calcular-saldo-mensal', orderIndex: 3,
      title: 'Calcular seu saldo mensal disponível',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Com base nos gastos registrados: subtraia o total de despesas da sua renda líquida mensal. Esse número — positivo ou negativo — é o seu ponto de partida real. Se for negativo, você está acumulando dívidas todo mês sem perceber.',
    },
    {
      phaseId: 0, slug: 'abrir-corretora', orderIndex: 4,
      title: 'Abrir conta em corretora ou banco digital',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Crie conta em uma corretora séria (XP, Rico, Clear, Nu Invest) ou banco digital com rendimento automático (Nubank, Inter, C6 Bank). Não precisa aportar ainda — só ter a plataforma pronta e explorar as opções disponíveis.',
    },
    {
      phaseId: 0, slug: 'estudar-3-pilares', orderIndex: 5,
      title: 'Estudar os 3 pilares do investimento',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Entenda o básico de: Renda Fixa (CDB, Tesouro Direto, LCI/LCA), Renda Variável (ações, ETFs, FIIs) e Reserva de Emergência (diferença entre guardar e investir). Sem esse mínimo, você investe por impulso — não por estratégia.',
    },

    // ─── FASE 1: QUITAÇÃO ─────────────────────────────────────────────────────
    {
      phaseId: 1, slug: 'criar-reserva-minima-1k', orderIndex: 1,
      title: 'Criar reserva de emergência mínima de R$ 1.000',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Antes de atacar as dívidas, separe R$ 1.000 em conta com liquidez diária (CDB D+0, conta remunerada ou Tesouro Selic). Esse valor existe para que um imprevisto não te jogue de volta ao cartão rotativo enquanto você está quitando.',
    },
    {
      phaseId: 1, slug: 'negociar-dividas-juros-altos', orderIndex: 2,
      title: 'Negociar ou refinanciar dívidas acima de 1,5% ao mês',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Para cada dívida acima de 1,5% ao mês (~19,6% ao ano): tente renegociar diretamente com o credor (portais como Serasa Limpa Nome têm descontos reais), ou substitua por crédito consignado, empréstimo com garantia de FGTS ou modalidade com juros menores. Mesmo 0,5% de diferença por mês equivale a centenas de reais a menos no total.',
    },
    {
      phaseId: 1, slug: 'eliminar-rotativo-cartao', orderIndex: 3,
      title: 'Eliminar definitivamente o cartão de crédito rotativo',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Pague o saldo total da fatura em aberto e estabeleça como regra inquebrável: nunca deixar fatura no rotativo. O cartão rotativo cobra entre 12% e 20% ao mês — não existe investimento no planeta que supere isso. Se necessário, cancele o cartão até ter disciplina para usá-lo apenas como meio de pagamento.',
    },
    {
      phaseId: 1, slug: 'eliminar-cheque-especial', orderIndex: 4,
      title: 'Eliminar cheque especial e empréstimos pessoais caros',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Quite o saldo devedor do cheque especial e de empréstimos pessoais com juros acima de 1,5% ao mês. Essas modalidades são armadilhas silenciosas: cobram juros mesmo quando você "mal usa". Se não conseguir quitar de uma vez, monte um plano agressivo — priorize essas dívidas antes de qualquer investimento além da reserva mínima.',
    },
    {
      phaseId: 1, slug: 'zerar-dividas-caras', orderIndex: 5,
      title: 'Quitar todas as dívidas com juros acima de 1,5% ao mês',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Marco final da fase: nenhuma dívida com juros maiores que 1,5% ao mês em aberto. Dívidas de imóvel, carro ou consignado com juros abaixo desse patamar podem continuar — são "dívidas saudáveis". A partir daqui, cada real investido trabalha integralmente a seu favor.',
    },

    // ─── FASE 2: RECRUTA ──────────────────────────────────────────────────────
    {
      phaseId: 2, slug: 'reserva-emergencia-3-meses', orderIndex: 1,
      title: 'Completar reserva de emergência para 3 meses de gastos',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Expanda a reserva para cobrir 3 meses completos dos seus gastos mensais médios, em conta com liquidez diária (CDB D+0, Tesouro Selic ou conta remunerada). Sem isso, qualquer imprevisto — doença, demissão, carro — força resgates de investimentos no pior momento possível.',
    },
    {
      phaseId: 2, slug: 'meta-500', orderIndex: 2,
      title: 'Atingir R$ 500 investidos',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '500.00', targetSmMultiple: null, requiredDurationDays: null,
      description: 'Primeiro contato real com o mercado. Pode ser Tesouro Selic, CDB de qualquer banco ou um ETF como o BOVA11. O objetivo não é o rendimento — é quebrar a inércia e sentir o dinheiro crescendo fora da conta corrente.',
    },
    {
      phaseId: 2, slug: 'automatizar-aporte', orderIndex: 3,
      title: 'Automatizar aporte mensal fixo (pague-se primeiro)',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Defina um valor fixo — mesmo que seja R$ 50 — e programe a transferência automática para o dia seguinte ao recebimento do salário. O segredo do aporte automático é que o dinheiro some antes que você pense em gastar. Isso transforma investir num hábito involuntário.',
    },
    {
      phaseId: 2, slug: 'dois-tipos-ativos', orderIndex: 4,
      title: 'Ter pelo menos 2 tipos diferentes de ativos',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Combine pelo menos duas categorias distintas: renda fixa (CDB, Tesouro Direto, LCI/LCA) e renda variável (uma ação, ETF ou FII). Diversificar desde o início cria o hábito certo de não concentrar risco num único ativo ou modalidade.',
    },
    {
      phaseId: 2, slug: 'meta-5k', orderIndex: 5,
      title: 'Atingir R$ 5.000 investidos',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '5000.00', targetSmMultiple: null, requiredDurationDays: null,
      description: 'O portfólio começa a tomar forma. A R$ 5.000 e 11% ao ano, o rendimento mensal estimado é ~R$ 46 — modesto, mas real. O hábito está plantado e o próximo marco está próximo.',
    },
    {
      phaseId: 2, slug: 'meta-10k', orderIndex: 6,
      title: 'Atingir R$ 10.000 investidos',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '10000.00', targetSmMultiple: null, requiredDurationDays: null,
      description: 'Marco histórico: você entrou no seleto grupo de brasileiros com patrimônio financeiro real. A R$ 10.000 e 11% ao ano, o portfólio gera ~R$ 92/mês — quase uma conta de luz paga pelo seu dinheiro. O compounding começou.',
    },

    // ─── FASE 3: SOLDADO ──────────────────────────────────────────────────────
    {
      phaseId: 3, slug: 'reserva-emergencia-6-meses', orderIndex: 1,
      title: 'Completar reserva de emergência para 6 meses de gastos',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Amplie a reserva para cobrir 6 meses completos de gastos em liquidez diária. Esse é o padrão recomendado para quem tem renda variável ou dependentes. A partir daqui você investe com convicção — sem medo de precisar resgatar numa crise.',
    },
    {
      phaseId: 3, slug: 'aumentar-aporte-10-porcento', orderIndex: 2,
      title: 'Aumentar o aporte mensal em pelo menos 10%',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Se você aportava R$ 500/mês, aumente para pelo menos R$ 550. Pequenas correções anuais têm impacto enorme no longo prazo: aumentar 10% ao ano durante 10 anos mais do que dobra o valor aportado. Revise sempre que tiver aumento de renda.',
    },
    {
      phaseId: 3, slug: 'tres-ativos-duas-categorias', orderIndex: 3,
      title: 'Ter pelo menos 3 ativos em 2 categorias distintas',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Ex: 2 ações diferentes + 1 CDB, ou 1 ETF + 1 FII + 1 Tesouro Direto. Diversificar entre pelo menos 2 categorias protege a carteira de quedas concentradas num único setor ou tipo de ativo.',
    },
    {
      phaseId: 3, slug: 'meta-25k', orderIndex: 4,
      title: 'Atingir R$ 25.000 investidos',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '25000.00', targetSmMultiple: null, requiredDurationDays: null,
      description: 'Metade do caminho para os R$ 50k. A R$ 25.000 e 11% ao ano, o portfólio gera ~R$ 229/mês — já começa a aparecer no extrato de forma perceptível.',
    },
    {
      phaseId: 3, slug: 'documentar-estrategia-alocacao', orderIndex: 5,
      title: 'Documentar estratégia de alocação por categoria',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Escreva, numa planilha ou documento, qual percentual você quer em cada categoria: ex. 40% renda fixa, 40% ações nacionais, 20% internacionais. Ter isso escrito e revisado anualmente evita decisões emocionais em quedas — você segue o plano, não o humor do mercado.',
    },
    {
      phaseId: 3, slug: 'meta-50k', orderIndex: 6,
      title: 'Atingir R$ 50.000 investidos',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '50000.00', targetSmMultiple: null, requiredDurationDays: null,
      description: 'A base está construída. R$ 50k investidos a 11% ao ano geram ~R$ 458/mês — praticamente um 13º salário gerado passivamente a cada 2 meses. Você é um soldado disciplinado.',
    },

    // ─── FASE 4: VETERANO ─────────────────────────────────────────────────────
    {
      phaseId: 4, slug: 'aporte-minimo-10-porcento-renda', orderIndex: 1,
      title: 'Aportar pelo menos 10% da renda bruta mensalmente',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: '10% é o mínimo histórico para acumulação sólida de longo prazo. Se a sua renda bruta é R$ 4.000, isso significa R$ 400/mês. Abaixo de 10%, os rendimentos mal compensam a inflação em 20+ anos. Acima de 20%, a jornada acelera significativamente.',
    },
    {
      phaseId: 4, slug: 'cinco-ativos-analise-propria', orderIndex: 2,
      title: 'Ter pelo menos 5 ativos com análise documentada',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Para cada ativo na sua carteira: registre em um documento por que comprou (tese de investimento), quais são os riscos principais e em que cenário venderia. Isso transforma você de especulador em investidor — e evita pânico em quedas quando você lembra por que está naquele ativo.',
    },
    {
      phaseId: 4, slug: 'meta-75k', orderIndex: 3,
      title: 'Atingir R$ 75.000 investidos',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '75000.00', targetSmMultiple: null, requiredDurationDays: null,
      description: 'Três quartos do caminho para os R$ 100k. A R$ 75k e 11% ao ano, o portfólio gera ~R$ 688/mês. A aceleração está próxima — cada aporte importa mais agora porque o compounding já se alimenta de uma base maior.',
    },
    {
      phaseId: 4, slug: 'aportes-12-meses-consecutivos', orderIndex: 4,
      title: 'Manter aportes mensais por 12 meses consecutivos',
      missionType: 'habit', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: 365,
      description: 'Um ano completo de aportes sem interrupção: sem mês pulado por "mercado caindo", sem pausa por "emergência planejável", sem exceção por "oportunidade única". A consistência por 12 meses prova que o hábito é real — não uma fase de empolgação.',
    },
    {
      phaseId: 4, slug: 'meta-100k', orderIndex: 5,
      title: 'Atingir R$ 100.000 investidos — O Clube dos 100k',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '100000.00', targetSmMultiple: null, requiredDurationDays: null,
      description: 'O marco mais simbólico do jogo. Menos de 3% dos brasileiros chegam aqui. A R$ 100k e 11% ao ano, o portfólio gera ~R$ 917/mês — mais do que um salário mínimo gerado passivamente todo mês, sem trabalhar um dia.',
    },

    // ─── FASE 5: ELITE ────────────────────────────────────────────────────────
    {
      phaseId: 5, slug: 'meta-150k', orderIndex: 1,
      title: 'Atingir R$ 150.000 investidos',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '150000.00', targetSmMultiple: null, requiredDurationDays: null,
      description: 'O portfólio tem massa crítica. A R$ 150k e 11% ao ano, o rendimento mensal estimado é ~R$ 1.375. Em meses bons de mercado, a valorização de um único dia pode superar o valor do seu aporte semanal.',
    },
    {
      phaseId: 5, slug: 'dois-ativos-internacionais', orderIndex: 2,
      title: 'Ter pelo menos 2 ativos internacionais na carteira',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Inclua ETFs globais (IVVB11, WRLD11) ou BDRs de empresas internacionais. Diversificação geográfica protege a carteira de crises localizadas no Brasil — quando o real desvaloriza, ativos em dólar ou euro compensam parte das perdas.',
    },
    {
      phaseId: 5, slug: 'meta-200k', orderIndex: 3,
      title: 'Atingir R$ 200.000 investidos',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '200000.00', targetSmMultiple: null, requiredDurationDays: null,
      description: 'R$ 200k a 11% ao ano geram ~R$ 1.833/mês. O rendimento mensal do portfólio já supera um salário mínimo. Dois terços do caminho para o Ponto de Cruzamento.',
    },
    {
      phaseId: 5, slug: 'ponto-de-cruzamento', orderIndex: 4,
      title: 'Ponto de Cruzamento: retorno mensal ≥ aporte mensal',
      missionType: 'crossover', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'O retorno mensal estimado do portfólio (patrimônio × taxa anual ÷ 12) superou o valor do seu aporte mensal. Isso significa que o dinheiro já trabalha mais do que você em termos de acumulação. A partir daqui, mesmo sem aportar, o patrimônio cresce — você ainda aporta para acelerar.',
    },
    {
      phaseId: 5, slug: 'meta-300k', orderIndex: 5,
      title: 'Atingir R$ 300.000 investidos',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '300000.00', targetSmMultiple: null, requiredDurationDays: null,
      description: 'R$ 300k a 11% ao ano geram ~R$ 2.750/mês — praticamente 2 salários mínimos gerados pelo patrimônio. O Ponto de Cruzamento já ficou para trás.',
    },

    // ─── FASE 6: ESPECIALISTA ─────────────────────────────────────────────────
    {
      phaseId: 6, slug: 'meta-400k', orderIndex: 1,
      title: 'Atingir R$ 400.000 investidos',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '400000.00', targetSmMultiple: null, requiredDurationDays: null,
      description: 'R$ 400k a 11% ao ano geram ~R$ 3.667/mês. O portfólio trabalha mais do que muitos empregos formais no Brasil. O compounding agora é sentido de forma concreta todo mês.',
    },
    {
      phaseId: 6, slug: 'renda-passiva-2sm', orderIndex: 2,
      title: 'Renda passiva mensal ≥ 2× salário mínimo',
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '2.0', requiredDurationDays: null,
      description: 'A renda passiva equivalente a 2 salários mínimos começa a ter significado concreto no orçamento — poderia pagar aluguel, carro e alimentação básica em muitas cidades brasileiras. Calculado automaticamente com base nos seus dados financeiros e no salário mínimo vigente.',
    },
    {
      phaseId: 6, slug: 'oito-ativos-tres-categorias', orderIndex: 3,
      title: 'Ter pelo menos 8 ativos em 3 categorias distintas',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Carteira madura: pelo menos 8 ativos distintos distribuídos em 3 categorias diferentes — ex: renda fixa (CDB, Tesouro, LCI/LCA), renda variável nacional (ações, ETFs, FIIs) e internacional (ETFs globais, BDRs). Essa diversificação reduz o risco não-sistemático da carteira.',
    },
    {
      phaseId: 6, slug: 'meta-500k', orderIndex: 4,
      title: 'Atingir R$ 500.000 investidos — Meio Milhão',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '500000.00', targetSmMultiple: null, requiredDurationDays: null,
      description: 'Meio milhão. R$ 500k a 11% ao ano geram ~R$ 4.583/mês. Você está entre os top 0,5% dos brasileiros em termos de patrimônio financeiro investido.',
    },
    {
      phaseId: 6, slug: 'renda-passiva-3sm', orderIndex: 5,
      title: 'Renda passiva mensal ≥ 3× salário mínimo',
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '3.0', requiredDurationDays: null,
      description: 'Equivalente a 3 salários mínimos gerados pelo patrimônio todo mês. Esse patamar permite viver com qualidade em cidades de médio porte brasileiras, pagando aluguel, alimentação, transporte e lazer — tudo sustentado pelos rendimentos.',
    },
    {
      phaseId: 6, slug: 'meta-600k', orderIndex: 6,
      title: 'Atingir R$ 600.000 investidos',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '600000.00', targetSmMultiple: null, requiredDurationDays: null,
      description: 'R$ 600k a 11% ao ano geram ~R$ 5.500/mês. A máquina está em pleno funcionamento. A fase seguinte é o caminho para o primeiro milhão.',
    },

    // ─── FASE 7: MESTRE ───────────────────────────────────────────────────────
    {
      phaseId: 7, slug: 'renda-passiva-3-5sm', orderIndex: 1,
      title: 'Renda passiva mensal ≥ 3,5× salário mínimo',
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '3.5', requiredDurationDays: null,
      description: 'Equivalente a 3,5 salários mínimos mensais gerados pelo patrimônio. A renda passiva já cobre um padrão de vida básico-confortável na maioria das cidades brasileiras. Você pode reduzir jornada sem comprometer a qualidade de vida.',
    },
    {
      phaseId: 7, slug: 'meta-750k', orderIndex: 2,
      title: 'Atingir R$ 750.000 investidos',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '750000.00', targetSmMultiple: null, requiredDurationDays: null,
      description: '75% do caminho para o primeiro milhão. R$ 750k a 11% ao ano geram ~R$ 6.875/mês — mais de 4× o salário mínimo em rendimentos mensais. A aceleração final está próxima.',
    },
    {
      phaseId: 7, slug: 'passiva-cobre-50-despesas', orderIndex: 3,
      title: 'Renda passiva cobre pelo menos 50% das despesas mensais',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Calcule: some toda a renda passiva real recebida nos últimos 3 meses e compare com o total de despesas. Se a renda passiva já paga mais da metade das contas, você precisa do trabalho apenas para completar a outra metade. O trabalho perdeu o poder de te prender.',
    },
    {
      phaseId: 7, slug: 'renda-passiva-4sm', orderIndex: 4,
      title: 'Renda passiva mensal ≥ 4× salário mínimo',
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '4.0', requiredDurationDays: null,
      description: 'Equivalente a 4 salários mínimos mensais gerados pelo patrimônio. Nesse patamar, você pode reduzir jornada para meio período, mudar de carreira para algo mais significativo, ou virar freelancer — sem nenhuma pressão financeira para aceitar trabalhos ruins.',
    },
    {
      phaseId: 7, slug: 'meta-1M', orderIndex: 5,
      title: 'Atingir R$ 1.000.000 investidos — O Primeiro Milhão',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '1000000.00', targetSmMultiple: null, requiredDurationDays: null,
      description: 'O primeiro milhão. R$ 1M a 11% ao ano gera ~R$ 9.167/mês — mais de 6× o salário mínimo passivamente, todo mês. Menos de 1% dos brasileiros chegam aqui. Não foi sorte — foi disciplina composta por anos.',
    },

    // ─── FASE 8: HERÓI ────────────────────────────────────────────────────────
    {
      phaseId: 8, slug: 'renda-passiva-5sm', orderIndex: 1,
      title: 'Renda passiva mensal ≥ 5× salário mínimo',
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '5.0', requiredDurationDays: null,
      description: 'Equivalente a 5 salários mínimos mensais gerados pelo patrimônio. Padrão de vida confortável em qualquer região brasileira — pagando moradia, alimentação, saúde, transporte e lazer — sustentado integralmente pelos rendimentos.',
    },
    {
      phaseId: 8, slug: 'meta-1-5M', orderIndex: 2,
      title: 'Atingir R$ 1.500.000 investidos',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '1500000.00', targetSmMultiple: null, requiredDurationDays: null,
      description: 'R$ 1,5M a 11% ao ano geram ~R$ 13.750/mês. O portfólio acumula mais por mês do que a maioria das pessoas recebe em salário. Você está na fase final da jornada.',
    },
    {
      phaseId: 8, slug: 'passiva-cobre-100-despesas', orderIndex: 3,
      title: 'Renda passiva cobre 100% das despesas por 3 meses consecutivos',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Por 3 meses seguidos, some toda a renda passiva recebida (dividendos, juros, rendimentos) e verifique que cobre 100% dos seus gastos sem precisar tocar no salário. Trabalho tornou-se opcional do ponto de vista financeiro.',
    },
    {
      phaseId: 8, slug: 'portfolio-cresce-apos-saques-3m', orderIndex: 4,
      title: 'Portfólio ainda cresce após sacar a renda passiva por 3 meses',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Por 3 meses seguidos: saque toda a renda passiva gerada para uso pessoal e verifique que o valor total do portfólio no final de cada mês ainda é maior do que no início. Isso confirma que você está em modo de perpetuação — o patrimônio cresce mesmo enquanto você o consome.',
    },
    {
      phaseId: 8, slug: 'renda-5sm-seis-meses-consecutivos', orderIndex: 5,
      title: 'Manter renda passiva ≥ 5× salário mínimo por 6 meses consecutivos',
      missionType: 'habit', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: 180,
      description: 'Seis meses seguidos com renda passiva ≥ 5× SM. Isso elimina o risco de ter sido apenas um bom período de mercado — é o novo patamar permanente do seu patrimônio.',
    },

    // ─── FASE 9: LENDA ────────────────────────────────────────────────────────
    {
      phaseId: 9, slug: 'renda-passiva-7sm', orderIndex: 1,
      title: 'Renda passiva mensal ≥ 7× salário mínimo',
      missionType: 'passive_income_sm', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: '7.0', requiredDurationDays: null,
      description: 'Equivalente a 7 salários mínimos mensais gerados pelo patrimônio. Padrão de vida excelente em qualquer cidade brasileira, com margem significativa para reinvestir parte dos rendimentos e acelerar ainda mais o crescimento do patrimônio.',
    },
    {
      phaseId: 9, slug: 'meta-2M', orderIndex: 2,
      title: 'Atingir R$ 2.000.000 investidos',
      missionType: 'portfolio_value', isRequiredForPhase: true,
      targetValue: '2000000.00', targetSmMultiple: null, requiredDurationDays: null,
      description: 'Dois milhões. R$ 2M a 11% ao ano geram ~R$ 18.333/mês. O patrimônio gera mais por mês do que a renda anual de 80% dos brasileiros. A riqueza é perpétua: você gasta confortavelmente e o capital ainda cresce.',
    },
    {
      phaseId: 9, slug: 'portfolio-cresce-12-meses', orderIndex: 3,
      title: 'Portfólio cresce após saques por 12 meses consecutivos',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Um ano completo: você viveu integralmente dos rendimentos e o valor total do portfólio no final do ano ainda é maior do que no início. A riqueza se perpetua sozinha — não é mais matematicamente possível quebrar dentro de um estilo de vida razoável.',
    },
    {
      phaseId: 9, slug: 'renda-7sm-seis-meses-consecutivos', orderIndex: 4,
      title: 'Manter renda passiva ≥ 7× salário mínimo por 6 meses consecutivos',
      missionType: 'habit', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: 180,
      description: 'Seis meses consecutivos com renda passiva ≥ 7× SM. A renda elevada é o novo piso — não uma exceção de mercado favorável.',
    },
    {
      phaseId: 9, slug: 'fire-confirmado', orderIndex: 5,
      title: 'FIRE confirmado: trabalho por necessidade financeira não existe mais',
      missionType: 'behavioral', isRequiredForPhase: true,
      targetValue: null, targetSmMultiple: null, requiredDurationDays: null,
      description: 'Marco final e inquebrável: você pode parar de trabalhar hoje, viver pelo resto da vida dos rendimentos sem comprometer o patrimônio, e ainda deixar herança. O Boss Final foi derrotado. Soberania total sobre seu tempo, seu trabalho e sua vida.',
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
