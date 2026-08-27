import { useState, useEffect, FormEvent } from 'react'
import { useTheme } from 'styled-components'
import { Button, Loading, useMessage, useToastStack, useConfirmModal, PaginatedGrid, ToggleSwitch, formatGroupedNumber, sanitizeNumericInput } from 'lcano-react-ui'
import { useAuth } from '../contexts/AuthContext'
import api, { extractApiErrorData } from '../services/api'
import { translateApiError, interpolate } from '../i18n'
import strings from '../i18n/strings'
import { getPhaseContent } from '../i18n/content'
import { Mission, Phase, UserProgress, PHASE_HEX_COLORS } from '../types'
import { buildPhaseAchievementToast } from '../utils/achievementToast'
import { buildUndoConfirmMessage } from '../utils/missionUndo'
import { MissionFinancials } from '../utils/missionProgress'
import AvatarDisplay from '../components/AvatarDisplay'
import ProgressBar from '../components/ProgressBar'
import MissionItem from '../components/MissionItem'
import ShareButton from '../components/ShareButton'
import {
  Page, Header, HeaderText, UserName, UserPhase, UserHandle, Grid, MainCol, SideCol, Card,
  SectionLabel, PhaseTitle, PhaseSubtitle, FlavorText, MissionsSectionLabel, MissionsHeader,
  EmptyMissionsText, FormLabel, Input, FormFields, IndicatorRow, IndicatorLabel, IndicatorValue,
  Divider, ErrorText, LoadingWrap,
} from './Dashboard.styles'

const PHASE_INTRODUCING = {
  investedAmount: 2,
  monthlyContribution: 5,
  monthlyPassiveIncome: 6,
} as const

type MissionFilter = 'pending' | 'all'

export default function Dashboard() {
  const { user } = useAuth()
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
      setError(strings.dashboard.errorLoad)
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
        showSuccess(strings.dashboard.phaseAdvanced)
        if (phase) notify([buildPhaseAchievementToast(phase)])
      } else if (res.data.newlyCompleted?.length > 0) {
        showSuccess(interpolate(strings.dashboard.missionsAutoCompleted, { count: res.data.newlyCompleted.length }))
      }
      const phaseRes = await api.get('/phases/current')
      setPhase(phaseRes.data)
    } catch {
      showError(strings.dashboard.errorUpdate)
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
      if (completed) showSuccess(strings.dashboard.missionCompleted)
      if (completed && res.data.phaseAdvanced && completedPhase) {
        notify([buildPhaseAchievementToast(completedPhase)])
      }
      if (!completed && res.data.phaseRolledBack) {
        showError(interpolate(strings.mission.phaseRolledBack, { phase: getPhaseContent(phaseRes.data.slug).name }))
      }
    } catch (err: unknown) {
      showError(translateApiError(extractApiErrorData(err), strings.dashboard.errorMission))
    }
  }

  async function handleStartMission(id: number) {
    try {
      await api.post(`/missions/${id}/start`)
      const phaseRes = await api.get('/phases/current')
      setPhase(phaseRes.data)
      showSuccess(strings.dashboard.trackingStarted)
    } catch (err: unknown) {
      showError(translateApiError(extractApiErrorData(err), strings.dashboard.errorTracking))
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
    showPortfolioTracking && { label: strings.dashboard.fields.investedAmount, key: 'investedAmount' as const },
    showContribution && { label: strings.dashboard.fields.monthlyContribution, key: 'monthlyContribution' as const },
    showPassiveIncome && { label: strings.dashboard.fields.monthlyPassiveIncome, key: 'monthlyPassiveIncome' as const },
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
          <UserName>{interpolate(strings.dashboard.greeting, { name: user?.name })}</UserName>
          <UserPhase>
            {phase && phaseContent ? `${phaseContent.name} — ${phaseContent.title}` : strings.dashboard.loadingPhase}
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
                  <SectionLabel>{strings.dashboard.currentPhase}</SectionLabel>
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
              <MissionsSectionLabel style={{ marginBottom: 0 }}>{strings.dashboard.missionsSection}</MissionsSectionLabel>
              <ToggleSwitch
                optionA={{ label: strings.dashboard.missionsFilter.pending, value: 'pending' }}
                optionB={{ label: strings.dashboard.missionsFilter.all, value: 'all' }}
                value={missionFilter}
                onChange={setMissionFilter}
              />
            </MissionsHeader>
            {visibleMissions.length === 0 ? (
              <EmptyMissionsText>{strings.dashboard.noMissionsPending}</EmptyMissionsText>
            ) : (
              <PaginatedGrid
                items={visibleMissions}
                keyExtractor={mission => mission.id}
                emptyMessage={strings.dashboard.noMissionsPending}
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
              <MissionsSectionLabel>{strings.dashboard.updateData}</MissionsSectionLabel>
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
                    description={saving ? strings.dashboard.updating : strings.dashboard.updateProgress}
                    disabled={saving}
                    style={{ borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600' }}
                  />
                </FormFields>
              </form>
            </Card>

            <Card>
              <MissionsSectionLabel>{strings.dashboard.indicators}</MissionsSectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <IndicatorRow>
                  <IndicatorLabel>{strings.dashboard.monthlyReturn}</IndicatorLabel>
                  <IndicatorValue>
                    R$ {monthlyReturn.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </IndicatorValue>
                </IndicatorRow>
                {showContribution && (
                  <IndicatorRow>
                    <IndicatorLabel>{strings.dashboard.crossoverPoint}</IndicatorLabel>
                    <IndicatorValue $success={crossoverReached}>
                      {crossoverReached ? strings.dashboard.crossoverReached : contribution > 0 ? `${Math.round((monthlyReturn / contribution) * 100)}%` : '—'}
                    </IndicatorValue>
                  </IndicatorRow>
                )}
                {showPassiveIncome && (
                  <>
                    <IndicatorRow>
                      <IndicatorLabel>{strings.dashboard.passiveIncomeSm}</IndicatorLabel>
                      <IndicatorValue $accent>
                        {smMultiple.toFixed(2)}× {strings.dashboard.minimumWageAbbrev}
                      </IndicatorValue>
                    </IndicatorRow>
                    <Divider>
                      <IndicatorRow>
                        <IndicatorLabel style={{ opacity: 0.6 }}>{strings.dashboard.minimumWageCurrent}</IndicatorLabel>
                        <span style={{ fontSize: 12, color: 'inherit', opacity: 0.5 }}>
                          R$ {minimumWage.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
