import { useState, useEffect, FormEvent } from 'react'
import styled from 'styled-components'
import { Button, Loading, useMessage } from 'lcano-react-ui'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { Phase, UserProgress, PHASE_HEX_COLORS } from '../types'
import AvatarDisplay from '../components/AvatarDisplay'
import ProgressBar from '../components/ProgressBar'
import MissionItem from '../components/MissionItem'
import ShareButton from '../components/ShareButton'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.3s ease-out;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const HeaderText = styled.div``

const UserName = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${p => p.theme.colors.white};
`

const UserPhase = styled.p`
  color: ${p => p.theme.colors.gray};
`

const UserHandle = styled.p`
  font-size: 14px;
  color: #4b5563;
  margin-top: 4px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

const MainCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 1024px) {
    grid-column: span 2;
  }
`

const SideCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Card = styled.div`
  background: ${p => p.theme.colors.secondary};
  border: 1px solid ${p => p.theme.colors.tertiary};
  border-radius: 12px;
  padding: 20px;
`

const SectionLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${p => p.theme.colors.quaternary};
`

const PhaseTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${p => p.theme.colors.white};
`

const PhaseSubtitle = styled.p`
  font-size: 14px;
  color: ${p => p.theme.colors.gray};
`

const FlavorText = styled.p`
  font-size: 14px;
  color: ${p => p.theme.colors.gray};
  margin-top: 12px;
  font-style: italic;
`

const MissionsSectionLabel = styled.h3`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6b7280;
  margin-bottom: 12px;
`

const MissionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const FormLabel = styled.label`
  display: block;
  font-size: 12px;
  color: ${p => p.theme.colors.gray};
  margin-bottom: 4px;
`

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${p => p.theme.colors.primary};
  border: 1px solid ${p => p.theme.colors.tertiary};
  color: ${p => p.theme.colors.white};
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder { color: #374151; }
  &:focus { border-color: ${p => p.theme.colors.quaternary}; }
`

const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const IndicatorRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const IndicatorLabel = styled.span`
  font-size: 12px;
  color: ${p => p.theme.colors.gray};
`

const IndicatorValue = styled.span<{ $accent?: boolean; $success?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${p => p.$success ? p.theme.colors.success : p.$accent ? p.theme.colors.quaternary : p.theme.colors.white};
`

const Divider = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 8px;
  margin-top: 4px;
`

const ErrorText = styled.p`
  color: #f87171;
  font-size: 14px;
`

const LoadingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 256px;
`

const LoadingLabel = styled.div`
  color: ${p => p.theme.colors.quaternary};
  animation: fadeIn 0.6s ease-out infinite alternate;
`

const FIELDS = [
  { label: 'Patrimônio investido (R$)', key: 'investedAmount', placeholder: '0' },
  { label: 'Renda passiva mensal (R$)', key: 'monthlyPassiveIncome', placeholder: '0' },
  { label: 'Aporte mensal (R$)', key: 'monthlyContribution', placeholder: '0' },
  { label: 'Taxa de retorno anual (%)', key: 'annualReturnRate', placeholder: '11' },
] as const

export default function Dashboard() {
  const { user } = useAuth()
  const { showSuccess, showError } = useMessage()
  const [phase, setPhase] = useState<Phase | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [minimumWage, setMinimumWage] = useState(1412)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    investedAmount: '',
    monthlyPassiveIncome: '',
    monthlyContribution: '',
    annualReturnRate: '11',
  })

  useEffect(() => {
    Promise.all([
      api.get('/phases/current'),
      api.get('/user/profile'),
      api.get('/config/minimum-wage'),
    ]).then(([phaseRes, profileRes, wageRes]) => {
      setPhase(phaseRes.data)
      const prog = profileRes.data.progress
      setProgress(prog)
      setMinimumWage(wageRes.data.value)
      if (prog) {
        setForm({
          investedAmount: parseFloat(prog.investedAmount).toString(),
          monthlyPassiveIncome: parseFloat(prog.monthlyPassiveIncome).toString(),
          monthlyContribution: parseFloat(prog.monthlyContribution).toString(),
          annualReturnRate: parseFloat(prog.annualReturnRate).toString(),
        })
      }
    }).catch(() => {
      setError('Não foi possível carregar os dados. Tente recarregar a página.')
    }).finally(() => setLoading(false))
  }, [])

  async function handleProgressUpdate(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put('/user/progress', {
        investedAmount: parseFloat(form.investedAmount) || 0,
        monthlyPassiveIncome: parseFloat(form.monthlyPassiveIncome) || 0,
        monthlyContribution: parseFloat(form.monthlyContribution) || 0,
        annualReturnRate: parseFloat(form.annualReturnRate) || 11,
      })
      setProgress(res.data.progress)
      if (res.data.phaseAdvanced) {
        showSuccess('Fase concluída! Avançou para a próxima fase!')
      } else if (res.data.newlyCompleted?.length > 0) {
        showSuccess(`${res.data.newlyCompleted.length} missão(ões) completada(s) automaticamente!`)
      }
      const phaseRes = await api.get('/phases/current')
      setPhase(phaseRes.data)
    } catch {
      showError('Erro ao salvar progresso. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleMission(id: number, completed: boolean) {
    try {
      const res = await api.post(`/missions/${id}/${completed ? 'complete' : 'uncomplete'}`)
      const [phaseRes, profileRes] = await Promise.all([
        api.get('/phases/current'),
        api.get('/user/profile'),
      ])
      setPhase(phaseRes.data)
      setProgress(profileRes.data.progress)
      if (completed) showSuccess('Missão concluída!')
      if (!completed && res.data.phaseRolledBack) {
        showError(`Fase revertida para: ${phaseRes.data.name}`)
      }
    } catch (err: any) {
      showError(err?.response?.data?.error ?? 'Erro ao atualizar missão. Tente novamente.')
    }
  }

  async function handleStartMission(id: number) {
    try {
      await api.post(`/missions/${id}/start`)
      const phaseRes = await api.get('/phases/current')
      setPhase(phaseRes.data)
      showSuccess('Rastreamento iniciado!')
    } catch (err: any) {
      showError(err?.response?.data?.error ?? 'Erro ao iniciar rastreamento.')
    }
  }

  const invested = parseFloat(form.investedAmount) || 0
  const annualRate = parseFloat(form.annualReturnRate) || 11
  const contribution = parseFloat(form.monthlyContribution) || 0
  const passive = parseFloat(form.monthlyPassiveIncome) || 0
  const monthlyReturn = invested * (annualRate / 100 / 12)
  const crossoverReached = contribution > 0 && monthlyReturn >= contribution
  const smMultiple = minimumWage > 0 ? passive / minimumWage : 0

  if (loading) return (
    <LoadingWrap>
      <Loading isLoading />
    </LoadingWrap>
  )

  if (error) return (
    <LoadingWrap>
      <ErrorText>{error}</ErrorText>
    </LoadingWrap>
  )

  const phaseColor = phase ? (PHASE_HEX_COLORS[phase.color] || '#7c3aed') : '#7c3aed'

  return (
    <Page>
      <Header>
        <AvatarDisplay phaseId={progress?.currentPhaseId ?? 0} size="md" />
        <HeaderText>
          <UserName>Olá, {user?.name}!</UserName>
          <UserPhase>
            {phase ? `${phase.achievementIcon} ${phase.name} — ${phase.title}` : 'Carregando fase...'}
          </UserPhase>
          <UserHandle>@{user?.username}</UserHandle>
        </HeaderText>
        <div style={{ marginLeft: 'auto' }}>
          {user && <ShareButton username={user.username} />}
        </div>
      </Header>

      <Grid>
        <MainCol>
          {phase && (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <SectionLabel>Fase Atual</SectionLabel>
                  <PhaseTitle>{phase.title}</PhaseTitle>
                  <PhaseSubtitle>{phase.subtitle}</PhaseSubtitle>
                </div>
                <span style={{ fontSize: 36 }}>{phase.achievementIcon}</span>
              </div>
              <ProgressBar percent={phase.progressPercent} color={phaseColor} height="12px" showLabel />
              <FlavorText>&quot;{phase.flavorText}&quot;</FlavorText>
            </Card>
          )}

          <Card>
            <MissionsSectionLabel>Missões da Fase</MissionsSectionLabel>
            <MissionList>
              {phase?.missions.map(mission => (
                <MissionItem
                  key={mission.id}
                  mission={mission}
                  minimumWage={minimumWage}
                  onToggle={handleToggleMission}
                  onStart={handleStartMission}
                />
              ))}
            </MissionList>
          </Card>
        </MainCol>

        <SideCol>
          <Card>
            <MissionsSectionLabel>Atualizar Dados</MissionsSectionLabel>
            <form onSubmit={handleProgressUpdate}>
              <FormFields>
                {FIELDS.map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <FormLabel>{label}</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
                <Button
                  type="submit"
                  variant="quaternary"
                  width="100%"
                  description={saving ? 'Salvando...' : 'Atualizar Progresso'}
                  disabled={saving}
                  style={{ borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600' }}
                />
              </FormFields>
            </form>
          </Card>

          <Card>
            <MissionsSectionLabel>Indicadores</MissionsSectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <IndicatorRow>
                <IndicatorLabel>Retorno mensal estimado</IndicatorLabel>
                <IndicatorValue>
                  R$ {monthlyReturn.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </IndicatorValue>
              </IndicatorRow>
              <IndicatorRow>
                <IndicatorLabel>Ponto de Cruzamento</IndicatorLabel>
                <IndicatorValue $success={crossoverReached}>
                  {crossoverReached ? '✓ Atingido' : contribution > 0 ? `${Math.round((monthlyReturn / contribution) * 100)}%` : '—'}
                </IndicatorValue>
              </IndicatorRow>
              <IndicatorRow>
                <IndicatorLabel>Renda passiva em SM</IndicatorLabel>
                <IndicatorValue $accent>
                  {smMultiple.toFixed(2)}× SM
                </IndicatorValue>
              </IndicatorRow>
              <Divider>
                <IndicatorRow>
                  <IndicatorLabel style={{ color: '#4b5563' }}>Salário Mínimo atual</IndicatorLabel>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                    R$ {minimumWage.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </IndicatorRow>
              </Divider>
            </div>
          </Card>
        </SideCol>
      </Grid>
    </Page>
  )
}
