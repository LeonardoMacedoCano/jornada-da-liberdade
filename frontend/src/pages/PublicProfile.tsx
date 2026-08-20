import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { Button, PaginatedGrid, BadgeCard } from 'lcano-react-ui'
import api from '../services/api'
import { getPhaseContent } from '../i18n/content'
import strings from '../i18n/strings'
import { interpolate } from '../i18n'
import { PublicProfile as PublicProfileType, PHASE_HEX_COLORS } from '../types'
import AvatarDisplay from '../components/AvatarDisplay'
import ProgressBar from '../components/ProgressBar'
import ShareButton from '../components/ShareButton'

const Page = styled.div`
  min-height: 100vh;
  background: ${p => p.theme.colors.primary};
`

const Container = styled.div`
  max-width: 672px;
  margin: 0 auto;
  padding: 48px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.3s ease-out;
`

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  gap: 16px;
`

const ProfileHeader = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`

const ProfileName = styled.h1`
  font-size: 30px;
  font-weight: 700;
  color: ${p => p.theme.colors.white};
`

const ProfileHandle = styled.p`
  color: ${p => p.theme.colors.gray};
  margin-top: 4px;
`

const ProfileMeta = styled.p`
  font-size: 14px;
  color: ${p => p.theme.colors.gray}99;
  margin-top: 8px;
`

const Card = styled.div`
  background: ${p => p.theme.colors.secondary};
  border: 1px solid ${p => p.theme.colors.tertiary};
  border-radius: 12px;
  padding: 20px;
`

const SectionLabel = styled.h2`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${p => p.theme.colors.gray};
  margin-bottom: 16px;
`

const PhaseCard = styled(Card)`
  text-align: center;
`

const PhaseIcon = styled.div`
  font-size: 36px;
  margin-bottom: 8px;
`

const PhaseName = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${p => p.theme.colors.quaternary};
`

const PhaseTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${p => p.theme.colors.white};
  margin-top: 4px;
`

const ProgressWrap = styled.div`
  max-width: 320px;
  margin: 12px auto 0;
`

const ProgressNote = styled.p`
  font-size: 12px;
  color: ${p => p.theme.colors.gray};
  margin-top: 8px;
`

const FinancialGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`

const FinancialItem = styled.div`
  text-align: center;
`

const FinancialLabel = styled.div`
  font-size: 12px;
  color: ${p => p.theme.colors.gray};
`

const FinancialValue = styled.div<{ $success?: boolean }>`
  font-size: 18px;
  font-weight: 700;
  margin-top: 4px;
  color: ${p => p.$success ? p.theme.colors.success : p.theme.colors.white};
`

const CtaSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`

const CtaText = styled.p`
  font-size: 14px;
  color: ${p => p.theme.colors.gray}99;
`

const CtaLink = styled(Link)`
  color: ${p => p.theme.colors.quaternary};
  text-decoration: none;

  &:hover { color: ${p => p.theme.colors.quaternary}cc; }
`

const NotFoundTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${p => p.theme.colors.white};
`

const NotFoundText = styled.p`
  color: ${p => p.theme.colors.gray};
`

const LoadingText = styled.div`
  color: ${p => p.theme.colors.quaternary};
  animation: fadeIn 0.6s ease-out infinite alternate;
`

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>()
  const theme = useTheme()
  const [profile, setProfile] = useState<PublicProfileType | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/share/${username}`)
      .then(res => setProfile(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [username])

  if (loading) return (
    <Page>
      <Center>
        <LoadingText>{strings.publicProfile.loading}</LoadingText>
      </Center>
    </Page>
  )

  if (notFound) return (
    <Page>
      <Center>
        <div style={{ fontSize: 56 }}>🔒</div>
        <NotFoundTitle>{strings.publicProfile.notFoundTitle}</NotFoundTitle>
        <NotFoundText>{strings.publicProfile.notFoundText}</NotFoundText>
        <Button
          variant="quaternary"
          description={strings.publicProfile.createAccount}
          onClick={() => window.location.href = '/login'}
          style={{ borderRadius: '8px', padding: '12px 24px', fontSize: '16px', fontWeight: '600' }}
        />
      </Center>
    </Page>
  )

  if (!profile) return null

  const phaseColor = profile.currentPhase
    ? (PHASE_HEX_COLORS[profile.currentPhase.color] || theme.colors.quaternary)
    : theme.colors.quaternary
  const daysSinceStart = Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Page>
      <Container>
        <ProfileHeader>
          <AvatarDisplay icon={profile.currentPhase?.achievementIcon ?? '💎'} size="lg" />
          <div>
            <ProfileName>{profile.name}</ProfileName>
            <ProfileHandle>@{profile.username}</ProfileHandle>
            <ProfileMeta>
              {interpolate(strings.publicProfile.daysSince, { days: daysSinceStart, date: new Date(profile.createdAt).toLocaleDateString('pt-BR') })}
            </ProfileMeta>
          </div>
        </ProfileHeader>

        {profile.currentPhase && (
          <PhaseCard>
            <PhaseIcon>{profile.currentPhase.achievementIcon}</PhaseIcon>
            <PhaseName>{getPhaseContent(profile.currentPhase.slug).name}</PhaseName>
            <PhaseTitle>{getPhaseContent(profile.currentPhase.slug).title}</PhaseTitle>
            <ProgressWrap>
              <ProgressBar percent={profile.progressPercent} color={phaseColor} height="8px" showLabel />
            </ProgressWrap>
            <ProgressNote>{interpolate(strings.publicProfile.phaseProgress, { percent: profile.progressPercent })}</ProgressNote>
          </PhaseCard>
        )}

        {profile.achievements.length > 0 && (
          <Card>
            <SectionLabel>🏆 {interpolate(strings.publicProfile.achievements, { count: profile.achievements.length })}</SectionLabel>
            <PaginatedGrid
              items={profile.achievements}
              keyExtractor={a => a.phaseId}
              emptyMessage=""
              minItemWidth="140px"
              renderItem={a => {
                const content = getPhaseContent(a.phaseSlug)
                return (
                  <BadgeCard
                    icon={a.achievementIcon}
                    title={content.achievementName}
                    description={content.name}
                    meta={interpolate(strings.phase.completedOn, { date: new Date(a.completedAt).toLocaleDateString('pt-BR') })}
                    height="130px"
                  />
                )
              }}
            />
          </Card>
        )}

        {profile.financialData && (
          <Card>
            <SectionLabel>📊 {strings.publicProfile.financialData}</SectionLabel>
            <FinancialGrid>
              <FinancialItem>
                <FinancialLabel>{strings.publicProfile.investedAmount}</FinancialLabel>
                <FinancialValue>
                  R$ {parseFloat(profile.financialData.investedAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </FinancialValue>
              </FinancialItem>
              <FinancialItem>
                <FinancialLabel>{strings.publicProfile.monthlyPassiveIncome}</FinancialLabel>
                <FinancialValue $success>
                  R$ {parseFloat(profile.financialData.monthlyPassiveIncome).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </FinancialValue>
              </FinancialItem>
            </FinancialGrid>
          </Card>
        )}

        <CtaSection>
          <ShareButton username={profile.username} />
          <CtaText>
            {strings.publicProfile.ctaText}{' '}
            <CtaLink to="/login">{strings.publicProfile.ctaLink}</CtaLink>
          </CtaText>
        </CtaSection>
      </Container>
    </Page>
  )
}
