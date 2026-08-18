import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Loading, PaginatedGrid, BadgeCard } from 'lcano-react-ui'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import { getPhaseContent, getMissionContent } from '../i18n/content'
import { Phase, Mission, MISSION_TYPE_ICONS } from '../types'

interface CompletedMission extends Mission {
  phaseSlug: string
  phaseColor: string
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
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

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${p => p.theme.colors.white};
`

const CountLabel = styled.span`
  font-size: 14px;
  color: ${p => p.theme.colors.gray}99;
`

const ShowcaseCard = styled.div`
  background: ${p => p.theme.colors.primary};
  border: 1px solid ${p => p.theme.colors.tertiary};
  border-radius: 12px;
  padding: 24px;
`

const EmptyText = styled.p`
  text-align: center;
  color: ${p => p.theme.colors.gray}99;
  font-size: 14px;
  margin-top: 16px;
`

const TimelineHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
`

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
  background: ${p => p.$active ? p.theme.colors.quaternary : `${p.theme.colors.white}0d`};
  color: ${p => p.$active ? p.theme.colors.white : p.theme.colors.gray};

  &:hover { color: ${p => p.theme.colors.white}; }
`

const EmptyCard = styled.div`
  text-align: center;
  padding: 48px;
  color: ${p => p.theme.colors.gray}99;
  background: ${p => p.theme.colors.secondary};
  border: 1px solid ${p => p.theme.colors.tertiary};
  border-radius: 12px;
`

const EmptyIcon = styled.div`
  font-size: 36px;
  margin-bottom: 12px;
`

const MissionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: ${p => p.theme.colors.secondary};
  border: 1px solid ${p => p.theme.colors.tertiary};
`

const MissionInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const MissionTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${p => p.theme.colors.white};
`

const MissionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  flex-wrap: wrap;
`

const MetaText = styled.span`
  font-size: 12px;
  color: ${p => p.theme.colors.gray};
`

const MissionDate = styled.div`
  font-size: 12px;
  color: ${p => p.theme.colors.success}b3;
  flex-shrink: 0;
`

const LoadingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 256px;
`

export default function History() {
  const { t, i18n } = useTranslation()
  const [phases, setPhases] = useState<Phase[]>([])
  const [completedMissions, setCompletedMissions] = useState<CompletedMission[]>([])
  const [filterPhaseId, setFilterPhaseId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/phases').then(res => {
      const data: Phase[] = res.data
      setPhases(data)
      const missions: CompletedMission[] = []
      data.forEach(phase => {
        phase.missions.forEach(m => {
          if (m.isCompleted && m.completedAt) {
            missions.push({ ...m, phaseSlug: phase.slug, phaseColor: phase.color })
          }
        })
      })
      missions.sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      setCompletedMissions(missions)
    }).finally(() => setLoading(false))
  }, [])

  const unlockedCount = phases.filter(p => p.status === 'completed').length

  const filtered = filterPhaseId !== null
    ? completedMissions.filter(m => m.phaseId === filterPhaseId)
    : completedMissions

  if (loading) return (
    <LoadingWrap>
      <Loading isLoading />
    </LoadingWrap>
  )

  return (
    <Page>
      <PageHeader>
        <Title>{t('history.title')}</Title>
        <Subtitle>{t('history.subtitle')}</Subtitle>
      </PageHeader>

      <section>
        <SectionHeader>
          <SectionTitle>{t('history.showcaseTitle')}</SectionTitle>
          <CountLabel>{t('history.unlockedCount', { count: unlockedCount, total: phases.length })}</CountLabel>
        </SectionHeader>

        <ShowcaseCard>
          <PaginatedGrid
            items={phases}
            keyExtractor={p => p.id}
            emptyMessage={t('history.emptyBadges')}
            minItemWidth="220px"
            renderItem={p => {
              const locked = p.status !== 'completed'
              const content = getPhaseContent(p.slug, i18n.language)
              return (
                <BadgeCard
                  icon={locked ? '🔒' : p.achievementIcon}
                  title={content.achievementName}
                  description={content.name}
                  meta={!locked && p.completedAt ? t('phase.completedOn', { date: new Date(p.completedAt).toLocaleDateString(i18n.language) }) : undefined}
                  active={!locked}
                />
              )
            }}
          />
          {unlockedCount === 0 && (
            <EmptyText>{t('history.emptyBadges')}</EmptyText>
          )}
        </ShowcaseCard>
      </section>

      <section>
        <TimelineHeader>
          <SectionTitle>
            {t('history.completedMissionsTitle')}{' '}
            <CountLabel>({filtered.length})</CountLabel>
          </SectionTitle>
          <FilterRow>
            <FilterButton $active={filterPhaseId === null} onClick={() => setFilterPhaseId(null)}>
              {t('history.filterAll')}
            </FilterButton>
            {phases.filter(p => p.missions.some(m => m.isCompleted)).map(p => (
              <FilterButton
                key={p.id}
                $active={filterPhaseId === p.id}
                onClick={() => setFilterPhaseId(p.id)}
              >
                {p.achievementIcon} {getPhaseContent(p.slug, i18n.language).name}
              </FilterButton>
            ))}
          </FilterRow>
        </TimelineHeader>

        {filtered.length === 0 ? (
          <EmptyCard>
            <EmptyIcon>🎯</EmptyIcon>
            <p>{t('history.emptyMissions')}</p>
          </EmptyCard>
        ) : (
          <PaginatedGrid
            items={filtered}
            keyExtractor={mission => mission.id}
            emptyMessage={t('history.emptyMissions')}
            minItemWidth="320px"
            renderItem={mission => (
              <MissionRow>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{MISSION_TYPE_ICONS[mission.missionType]}</span>
                <MissionInfo>
                  <MissionTitle>{getMissionContent(mission.slug, i18n.language).title}</MissionTitle>
                  <MissionMeta>
                    <MetaText>{getPhaseContent(mission.phaseSlug, i18n.language).name}</MetaText>
                    <MetaText>·</MetaText>
                    <MetaText>{t(`mission.types.${mission.missionType}`)}</MetaText>
                  </MissionMeta>
                </MissionInfo>
                <MissionDate>
                  {mission.completedAt ? new Date(mission.completedAt).toLocaleDateString(i18n.language) : ''}
                </MissionDate>
              </MissionRow>
            )}
          />
        )}
      </section>
    </Page>
  )
}
