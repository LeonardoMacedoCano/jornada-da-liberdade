import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from 'lcano-react-ui'
import api from '../services/api'
import { PublicProfile as PublicProfileType, PHASE_HEX_COLORS } from '../types'
import AvatarDisplay from '../components/AvatarDisplay'
import AchievementBadge from '../components/AchievementBadge'
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
  color: #4b5563;
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
  color: #6b7280;
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

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (min-width: 640px) { grid-template-columns: repeat(4, 1fr); }
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
  color: #4b5563;
`

const CtaLink = styled(Link)`
  color: #a78bfa;
  text-decoration: none;

  &:hover { color: #c4b5fd; }
`

const NotFoundTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${p => p.theme.colors.white};
`

const NotFoundText = styled.p`
  color: ${p => p.theme.colors.gray};
`

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>()
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
        <div style={{ color: '#7c3aed', animation: 'fadeIn 0.6s ease-out infinite alternate' }}>
          Carregando perfil...
        </div>
      </Center>
    </Page>
  )

  if (notFound) return (
    <Page>
      <Center>
        <div style={{ fontSize: 56 }}>🔒</div>
        <NotFoundTitle>Perfil não encontrado</NotFoundTitle>
        <NotFoundText>Este perfil é privado ou não existe.</NotFoundText>
        <Button
          variant="quaternary"
          description="Criar minha conta"
          onClick={() => window.location.href = '/login'}
          style={{ borderRadius: '8px', padding: '12px 24px', fontSize: '16px', fontWeight: '600' }}
        />
      </Center>
    </Page>
  )

  if (!profile) return null

  const phaseColor = profile.currentPhase
    ? (PHASE_HEX_COLORS[profile.currentPhase.color] || '#7c3aed')
    : '#7c3aed'
  const daysSinceStart = Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Page>
      <Container>
        <ProfileHeader>
          <AvatarDisplay phaseId={profile.currentPhase?.id ?? 0} size="lg" />
          <div>
            <ProfileName>{profile.name}</ProfileName>
            <ProfileHandle>@{profile.username}</ProfileHandle>
            <ProfileMeta>
              Na jornada há {daysSinceStart} dias · desde {new Date(profile.createdAt).toLocaleDateString('pt-BR')}
            </ProfileMeta>
          </div>
        </ProfileHeader>

        {profile.currentPhase && (
          <PhaseCard>
            <PhaseIcon>{profile.currentPhase.achievementIcon}</PhaseIcon>
            <PhaseName>{profile.currentPhase.name}</PhaseName>
            <PhaseTitle>{profile.currentPhase.title}</PhaseTitle>
            <ProgressWrap>
              <ProgressBar percent={profile.progressPercent} color={phaseColor} height="8px" showLabel />
            </ProgressWrap>
            <ProgressNote>{profile.progressPercent}% da fase concluída</ProgressNote>
          </PhaseCard>
        )}

        {profile.achievements.length > 0 && (
          <Card>
            <SectionLabel>🏆 Conquistas ({profile.achievements.length})</SectionLabel>
            <BadgeGrid>
              {profile.achievements.map(a => (
                <AchievementBadge key={a.phaseId} achievement={a} size="sm" />
              ))}
            </BadgeGrid>
          </Card>
        )}

        {profile.financialData && (
          <Card>
            <SectionLabel>📊 Dados Financeiros</SectionLabel>
            <FinancialGrid>
              <FinancialItem>
                <FinancialLabel>Patrimônio Investido</FinancialLabel>
                <FinancialValue>
                  R$ {parseFloat(profile.financialData.investedAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </FinancialValue>
              </FinancialItem>
              <FinancialItem>
                <FinancialLabel>Renda Passiva Mensal</FinancialLabel>
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
            Quer acompanhar sua própria jornada?{' '}
            <CtaLink to="/register">Criar conta grátis</CtaLink>
          </CtaText>
        </CtaSection>
      </Container>
    </Page>
  )
}
