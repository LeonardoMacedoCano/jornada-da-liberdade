import { useState, useEffect, FormEvent } from 'react'
import styled, { useTheme } from 'styled-components'
import { Button, Loading, useMessage, useToastStack, useConfirmModal, PaginatedGrid, ToggleSwitch, formatGroupedNumber, sanitizeNumericInput } from 'lcano-react-ui'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { translateApiError } from '../i18n'
import { getPhaseContent } from '../i18n/content'
import { Mission, Phase, UserProgress, PHASE_HEX_COLORS } from '../types'
import { buildPhaseAchievementToast } from '../utils/achievementToast'
import { buildUndoConfirmMessage } from '../utils/missionUndo'
import { MissionFinancials } from '../utils/missionProgress'
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
  color: ${p => p.theme.colors.gray}99;
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

const MainCol = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 1024px) {
    grid-column: ${p => p.$fullWidth ? 'span 3' : 'span 2'};
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
  color: ${p => p.theme.colors.gray};
  margin-bottom: 12px;
`

const MissionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`

const EmptyMissionsText = styled.p`
  text-align: center;
  color: ${p => p.theme.colors.gray}99;
  font-size: 14px;
  padding: 16px 0;
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

  &::placeholder { color: ${p => p.theme.colors.gray}60; }
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
  border-top: 1px solid ${p => p.theme.colors.white}0d;
  padding-top: 8px;
  margin-top: 4px;
`

const ErrorText = styled.p`
  color: ${p => p.theme.colors.warning};
  font-size: 14px;
`

const LoadingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 256px;
`

const PHASE_INTRODUCING = {
  investedAmount: 2,
  monthlyContribution: 5,
  monthlyPassiveIncome: 6,
} as const

type MissionFilter = 'pending' | 'all'

export default function Dashboard() {
  const { user } = useAuth()
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const { showSuccess, showError } = useMessage()
  const { notify } = useToastStack()
  const { confirm, ConfirmModalComponent } = useConfirmModal()
  const [phase, setPhase] = useState<Phase | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [minimumWage, setMinimumWage] = useState(1621)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [missionFilter, setMissionFilter] = useState<MissionFilter>('pending')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const [form, setForm] = useState({
    investedAmount: '',
    monthlyPassiveIncome: '',
    monthlyContribution: '',
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
        })
      }
    }).catch(() => {
      setError(t('dashboard.errorLoad'))
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
      })
      setProgress(res.data.progress)
      if (res.data.phaseAdvanced) {
        showSuccess(t('dashboard.phaseAdvanced'))
        if (phase) notify([buildPhaseAchievementToast(phase, t)])
      } else if (res.data.newlyCompleted?.length > 0) {
        showSuccess(t('dashboard.missionsAutoCompleted', { count: res.data.newlyCompleted.length }))
      }
      const phaseRes = await api.get('/phases/current')
      setPhase(phaseRes.data)
    } catch {
      showError(t('dashboard.errorUpdate'))
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleMission(id: number, completed: boolean) {
    try {
      const res = await api.post(`/missions/${id}/${completed ? 'complete' : 'uncomplete'}`)
      const completedPhase = phase
      const [phaseRes, profileRes] = await Promise.all([
        api.get('/phases/current'),
        api.get('/user/profile'),
      ])
      setPhase(phaseRes.data)
      setProgress(profileRes.data.progress)
      if (completed) showSuccess(t('dashboard.missionCompleted'))
      if (completed && res.data.phaseAdvanced && completedPhase) {
        notify([buildPhaseAchievementToast(completedPhase, t)])
      }
      if (!completed && res.data.phaseRolledBack) {
        showError(t('mission.phaseRolledBack', { phase: getPhaseContent(phaseRes.data.slug).name }))
      }
    } catch (err: unknown) {
      const data = (err as { response?: { data?: unknown } })?.response?.data
      showError(translateApiError(t, data, 'dashboard.errorMission'))
    }
  }

  async function handleStartMission(id: number) {
    try {
      await api.post(`/missions/${id}/start`)
      const phaseRes = await api.get('/phases/current')
      setPhase(phaseRes.data)
      showSuccess(t('dashboard.trackingStarted'))
    } catch (err: unknown) {
      const data = (err as { response?: { data?: unknown } })?.response?.data
      showError(translateApiError(t, data, 'dashboard.errorTracking'))
    }
  }

  async function handleUndoMission(mission: Mission) {
    const { title, description } = buildUndoConfirmMessage(mission, phase ?? undefined)
    const ok = await confirm(title, description)
    if (!ok) return
    await handleToggleMission(mission.id, false)
  }

  const currentPhaseId = progress?.currentPhaseId ?? 0
  const showPortfolioTracking = currentPhaseId >= PHASE_INTRODUCING.investedAmount
  const showContribution = currentPhaseId >= PHASE_INTRODUCING.monthlyContribution
  const showPassiveIncome = currentPhaseId >= PHASE_INTRODUCING.monthlyPassiveIncome

  const FIELDS = [
    showPortfolioTracking && { label: t('dashboard.fields.investedAmount'), key: 'investedAmount' as const },
    showContribution && { label: t('dashboard.fields.monthlyContribution'), key: 'monthlyContribution' as const },
    showPassiveIncome && { label: t('dashboard.fields.monthlyPassiveIncome'), key: 'monthlyPassiveIncome' as const },
  ].filter((f): f is { label: string; key: 'investedAmount' | 'monthlyContribution' | 'monthlyPassiveIncome' } => !!f)

  const visibleMissions = (phase?.missions ?? []).filter(m => missionFilter === 'all' || !m.isCompleted)

  const invested = parseFloat(form.investedAmount) || 0
  const annualRate = progress ? parseFloat(progress.annualReturnRate) || 11 : 11
  const contribution = parseFloat(form.monthlyContribution) || 0
  const passive = parseFloat(form.monthlyPassiveIncome) || 0
  const monthlyReturn = invested * (annualRate / 100 / 12)
  const crossoverReached = contribution > 0 && monthlyReturn >= contribution
  const smMultiple = minimumWage > 0 ? passive / minimumWage : 0

  const financials: MissionFinancials = {
    investedAmount: invested,
    monthlyContribution: contribution,
    monthlyPassiveIncome: passive,
    annualReturnRate: annualRate,
  }

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

  const phaseColor = phase ? (PHASE_HEX_COLORS[phase.color] || theme.colors.quaternary) : theme.colors.quaternary
  const phaseContent = phase ? getPhaseContent(phase.slug) : null

  return (
    <Page>
      <Header>
        <AvatarDisplay icon={phase?.achievementIcon ?? '💎'} size="md" />
        <HeaderText>
          <UserName>{t('dashboard.greeting', { name: user?.name })}</UserName>
          <UserPhase>
            {phase && phaseContent ? `${phaseContent.name} — ${phaseContent.title}` : t('dashboard.loadingPhase')}
          </UserPhase>
          <UserHandle>@{user?.username}</UserHandle>
        </HeaderText>
        <div style={{ marginLeft: 'auto' }}>
          {user && <ShareButton username={user.username} />}
        </div>
      </Header>

      <Grid>
        <MainCol $fullWidth={!showPortfolioTracking}>
          {phase && phaseContent && (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <SectionLabel>{t('dashboard.currentPhase')}</SectionLabel>
                  <PhaseTitle>{phaseContent.title}</PhaseTitle>
                  <PhaseSubtitle>{phaseContent.subtitle}</PhaseSubtitle>
                </div>
                <span style={{ fontSize: 36 }}>{phase.achievementIcon}</span>
              </div>
              <ProgressBar percent={phase.progressPercent} color={phaseColor} height="12px" showLabel />
              <FlavorText>&quot;{phaseContent.flavorText}&quot;</FlavorText>
            </Card>
          )}

          <Card>
            <MissionsHeader>
              <MissionsSectionLabel style={{ marginBottom: 0 }}>{t('dashboard.missionsSection')}</MissionsSectionLabel>
              <ToggleSwitch
                optionA={{ label: t('dashboard.missionsFilter.pending'), value: 'pending' }}
                optionB={{ label: t('dashboard.missionsFilter.all'), value: 'all' }}
                value={missionFilter}
                onChange={setMissionFilter}
              />
            </MissionsHeader>
            {visibleMissions.length === 0 ? (
              <EmptyMissionsText>{t('dashboard.noMissionsPending')}</EmptyMissionsText>
            ) : (
              <PaginatedGrid
                items={visibleMissions}
                keyExtractor={mission => mission.id}
                emptyMessage={t('dashboard.noMissionsPending')}
                minItemWidth="100%"
                rowsPerPage={3}
                renderItem={mission => (
                  <MissionItem
                    mission={mission}
                    minimumWage={minimumWage}
                    financials={financials}
                    onToggle={handleToggleMission}
                    onUndo={handleUndoMission}
                    onStart={handleStartMission}
                  />
                )}
              />
            )}
          </Card>
        </MainCol>

        {showPortfolioTracking && (
          <SideCol>
            <Card>
              <MissionsSectionLabel>{t('dashboard.updateData')}</MissionsSectionLabel>
              <form onSubmit={handleProgressUpdate}>
                <FormFields>
                  {FIELDS.map(({ label, key }) => (
                    <div key={key}>
                      <FormLabel>{label}</FormLabel>
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={focusedField === key ? form[key] : formatGroupedNumber(form[key], 'pt')}
                        onFocus={() => setFocusedField(key)}
                        onBlur={() => setFocusedField(null)}
                        onChange={e => setForm(f => ({ ...f, [key]: sanitizeNumericInput(e.target.value, 8, 2, 0) }))}
                        placeholder="0.00"
                      />
                    </div>
                  ))}
                  <Button
                    type="submit"
                    variant="quaternary"
                    width="100%"
                    description={saving ? t('dashboard.updating') : t('dashboard.updateProgress')}
                    disabled={saving}
                    style={{ borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600' }}
                  />
                </FormFields>
              </form>
            </Card>

            <Card>
              <MissionsSectionLabel>{t('dashboard.indicators')}</MissionsSectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <IndicatorRow>
                  <IndicatorLabel>{t('dashboard.monthlyReturn')}</IndicatorLabel>
                  <IndicatorValue>
                    R$ {monthlyReturn.toLocaleString(i18n.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </IndicatorValue>
                </IndicatorRow>
                {showContribution && (
                  <IndicatorRow>
                    <IndicatorLabel>{t('dashboard.crossoverPoint')}</IndicatorLabel>
                    <IndicatorValue $success={crossoverReached}>
                      {crossoverReached ? t('dashboard.crossoverReached') : contribution > 0 ? `${Math.round((monthlyReturn / contribution) * 100)}%` : '—'}
                    </IndicatorValue>
                  </IndicatorRow>
                )}
                {showPassiveIncome && (
                  <>
                    <IndicatorRow>
                      <IndicatorLabel>{t('dashboard.passiveIncomeSm')}</IndicatorLabel>
                      <IndicatorValue $accent>
                        {smMultiple.toFixed(2)}× {t('dashboard.minimumWageAbbrev')}
                      </IndicatorValue>
                    </IndicatorRow>
                    <Divider>
                      <IndicatorRow>
                        <IndicatorLabel style={{ opacity: 0.6 }}>{t('dashboard.minimumWageCurrent')}</IndicatorLabel>
                        <span style={{ fontSize: 12, color: 'inherit', opacity: 0.5 }}>
                          R$ {minimumWage.toLocaleString(i18n.language, { minimumFractionDigits: 2 })}
                        </span>
                      </IndicatorRow>
                    </Divider>
                  </>
                )}
              </div>
            </Card>
          </SideCol>
        )}
      </Grid>
      {ConfirmModalComponent}
    </Page>
  )
}
