import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Loading, useMessage, useToastStack, useConfirmModal } from 'lcano-react-ui'
import api from '../services/api'
import { interpolate } from '../i18n'
import strings from '../i18n/strings'
import { getPhaseContent } from '../i18n/content'
import { Mission, Phase } from '../types'
import { buildPhaseAchievementToast } from '../utils/achievementToast'
import { buildUndoConfirmMessage } from '../utils/missionUndo'
import { MissionFinancials } from '../utils/missionProgress'
import PhaseCard from '../components/PhaseCard'

const EMPTY_FINANCIALS: MissionFinancials = {
  investedAmount: 0,
  monthlyContribution: 0,
  monthlyPassiveIncome: 0,
  annualReturnRate: 11,
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: fadeIn 0.3s ease-out;
`

const PageHeader = styled.div``

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${p => p.theme.colors.white};
`

const Subtitle = styled.p`
  color: ${p => p.theme.colors.gray};
  margin-top: 4px;
`

const InflationNote = styled.p`
  color: ${p => p.theme.colors.gray}99;
  font-size: 12px;
  margin-top: 4px;
`

const PhaseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const PhaseWrapper = styled.div`
  position: relative;
`

const Connector = styled.div`
  position: absolute;
  left: 28px;
  top: 100%;
  height: 12px;
  width: 2px;
  background: ${p => p.theme.colors.white}14;
  z-index: 0;
`

const LoadingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 256px;
`

export default function Roadmap() {
  const { notify } = useToastStack()
  const { showError } = useMessage()
  const { confirm, ConfirmModalComponent } = useConfirmModal()
  const [phases, setPhases] = useState<Phase[]>([])
  const [minimumWage, setMinimumWage] = useState(1621)
  const [financials, setFinancials] = useState<MissionFinancials>(EMPTY_FINANCIALS)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/phases'),
      api.get('/config/minimum-wage'),
      api.get('/user/profile'),
    ]).then(([phasesRes, wageRes, profileRes]) => {
      setPhases(phasesRes.data)
      setMinimumWage(wageRes.data.value)
      const prog = profileRes.data.progress
      if (prog) {
        setFinancials({
          investedAmount: parseFloat(prog.investedAmount) || 0,
          monthlyContribution: parseFloat(prog.monthlyContribution) || 0,
          monthlyPassiveIncome: parseFloat(prog.monthlyPassiveIncome) || 0,
          annualReturnRate: parseFloat(prog.annualReturnRate) || 11,
        })
      }
      const active = phasesRes.data.find((p: Phase) => p.status === 'active')
      if (active) setExpandedId(active.id)
    }).finally(() => setLoading(false))
  }, [])

  async function handleToggleMission(id: number, completed: boolean) {
    try {
      const res = await api.post(`/missions/${id}/${completed ? 'complete' : 'uncomplete'}`)
      const completedPhase = phases.find(p => p.status === 'active')
      const phasesRes = await api.get('/phases')
      setPhases(phasesRes.data)
      if (completed && res.data.phaseAdvanced && completedPhase) {
        notify([buildPhaseAchievementToast(completedPhase)])
      }
      if (!completed && res.data.phaseRolledBack) {
        const newPhaseSlug = phasesRes.data.find((p: Phase) => p.id === res.data.newPhaseId)?.slug
        if (newPhaseSlug) {
          showError(interpolate(strings.mission.phaseRolledBack, { phase: getPhaseContent(newPhaseSlug).name }))
        }
      }
    } catch { /* ignore */ }
  }

  async function handleUndoMission(mission: Mission) {
    const owningPhase = phases.find(p => p.id === mission.phaseId)
    const { title, description } = buildUndoConfirmMessage(mission, owningPhase)
    const ok = await confirm(title, description)
    if (!ok) return
    await handleToggleMission(mission.id, false)
  }

  if (loading) return (
    <LoadingWrap>
      <Loading isLoading />
    </LoadingWrap>
  )

  const completedCount = phases.filter(p => p.status === 'completed').length

  return (
    <Page>
      <PageHeader>
        <Title>{strings.roadmap.title}</Title>
        <Subtitle>
          {interpolate(strings.roadmap.subtitle, { completed: completedCount, total: phases.length })}
        </Subtitle>
        <InflationNote>{strings.roadmap.nominalValuesNote}</InflationNote>
      </PageHeader>

      <PhaseList>
        {phases.map((phase, idx) => (
          <PhaseWrapper key={phase.id}>
            {idx < phases.length - 1 && <Connector />}
            <PhaseCard
              phase={phase}
              minimumWage={minimumWage}
              financials={financials}
              expanded={expandedId === phase.id}
              onToggleExpand={() => setExpandedId(expandedId === phase.id ? null : phase.id)}
              onToggleMission={handleToggleMission}
              onUndoMission={handleUndoMission}
            />
          </PhaseWrapper>
        ))}
      </PhaseList>
      {ConfirmModalComponent}
    </Page>
  )
}
