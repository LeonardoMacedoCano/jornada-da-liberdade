import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Loading } from 'lcano-react-ui'
import api from '../services/api'
import { Phase } from '../types'
import PhaseCard from '../components/PhaseCard'

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
  const [phases, setPhases] = useState<Phase[]>([])
  const [minimumWage, setMinimumWage] = useState(1412)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/phases'),
      api.get('/config/minimum-wage'),
    ]).then(([phasesRes, wageRes]) => {
      setPhases(phasesRes.data)
      setMinimumWage(wageRes.data.value)
      const active = phasesRes.data.find((p: Phase) => p.status === 'active')
      if (active) setExpandedId(active.id)
    }).finally(() => setLoading(false))
  }, [])

  async function handleToggleMission(id: number, completed: boolean) {
    try {
      await api.post(`/missions/${id}/${completed ? 'complete' : 'uncomplete'}`)
      const res = await api.get('/phases')
      setPhases(res.data)
    } catch { /* ignore */ }
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
        <Title>Roadmap da Jornada</Title>
        <Subtitle>
          {completedCount}/{phases.length} fases concluídas — Todas as fases são visíveis para motivar seu avanço
        </Subtitle>
      </PageHeader>

      <PhaseList>
        {phases.map((phase, idx) => (
          <PhaseWrapper key={phase.id}>
            {idx < phases.length - 1 && <Connector />}
            <PhaseCard
              phase={phase}
              minimumWage={minimumWage}
              expanded={expandedId === phase.id}
              onToggleExpand={() => setExpandedId(expandedId === phase.id ? null : phase.id)}
              onToggleMission={handleToggleMission}
            />
          </PhaseWrapper>
        ))}
      </PhaseList>
    </Page>
  )
}
