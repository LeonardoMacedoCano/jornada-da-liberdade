import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { GoogleSignInButton } from 'lcano-react-ui'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { translateApiError } from '../i18n'
import { getPhaseContent } from '../i18n/content'
import { PHASE_HEX_COLORS } from '../types'

const glow = keyframes`
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
`

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background:
    radial-gradient(circle at 50% -10%, ${p => p.theme.colors.secondary} 0%, ${p => p.theme.colors.primary} 60%),
    ${p => p.theme.colors.primary};
`

const Wrapper = styled.div`
  width: 100%;
  max-width: 440px;
  animation: fadeIn 0.4s ease-out;
`

const Hero = styled.div`
  text-align: center;
  margin-bottom: 28px;
`

const IconRing = styled.div`
  width: 84px;
  height: 84px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  background: ${p => p.theme.colors.quaternary}1a;
  border: 1px solid ${p => p.theme.colors.quaternary}4d;
  box-shadow: 0 0 32px ${p => p.theme.colors.quaternary}33;
  animation: ${glow} 3s ease-in-out infinite;
`

const HeroTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${p => p.theme.colors.white};
`

const HeroSub = styled.p`
  color: ${p => p.theme.colors.gray};
  margin-top: 8px;
  font-size: 15px;
`

const FlavorQuote = styled.p`
  color: ${p => p.theme.colors.gray}b3;
  font-size: 13px;
  font-style: italic;
  margin-top: 16px;
  padding: 0 16px;
`

const PhaseDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
`

const PhaseDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.$color};
`

const Card = styled.div`
  background: ${p => p.theme.colors.secondary};
  border: 1px solid ${p => p.theme.colors.tertiary};
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: 0 20px 40px ${p => p.theme.colors.black}40;
`

const CardAccent = styled.div`
  height: 3px;
  width: 56px;
  border-radius: 999px;
  background: ${p => p.theme.colors.quaternary};
`

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${p => p.theme.colors.white};
  text-align: center;
`

const ErrorBox = styled.div`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background: ${p => p.theme.colors.warning}1a;
  border: 1px solid ${p => p.theme.colors.warning}4d;
  color: ${p => p.theme.colors.warning};
  font-size: 14px;
  text-align: center;
`

const ButtonWrap = styled.div`
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StatusText = styled.p`
  color: ${p => p.theme.colors.gray};
  font-size: 14px;
`

const FooterNote = styled.p`
  text-align: center;
  color: ${p => p.theme.colors.gray}99;
  font-size: 12px;
  margin-top: 20px;
  padding: 0 16px;
`

export default function Login() {
  const { loginWithGoogle, googleClientId } = useAuth()
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const tutorialFlavor = getPhaseContent('tutorial').flavorText

  async function handleCredential(credential: string) {
    setError('')
    try {
      await loginWithGoogle(credential)
    } catch (err: unknown) {
      const data = (err as { response?: { data?: unknown } })?.response?.data
      setError(translateApiError(t, data, 'auth.login.errorGeneric'))
    }
  }

  return (
    <Page>
      <Wrapper>
        <Hero>
          <IconRing>💎</IconRing>
          <HeroTitle>{t('auth.login.heroTitle')}</HeroTitle>
          <HeroSub>{t('auth.login.heroSub')}</HeroSub>
          <FlavorQuote>&quot;{tutorialFlavor}&quot;</FlavorQuote>
          <PhaseDots aria-hidden="true">
            {Object.values(PHASE_HEX_COLORS).map(color => (
              <PhaseDot key={color} $color={color} />
            ))}
          </PhaseDots>
        </Hero>
        <Card>
          <CardAccent />
          <CardTitle>{t('auth.login.cardTitle')}</CardTitle>
          {error && <ErrorBox>{error}</ErrorBox>}
          <ButtonWrap>
            {googleClientId === undefined ? (
              <StatusText>{t('common.loading')}</StatusText>
            ) : googleClientId ? (
              <GoogleSignInButton clientId={googleClientId} onCredential={handleCredential} locale="pt" />
            ) : (
              <ErrorBox>{t('auth.login.notConfigured')}</ErrorBox>
            )}
          </ButtonWrap>
        </Card>
        <FooterNote>{t('auth.login.footerNote')}</FooterNote>
      </Wrapper>
    </Page>
  )
}
