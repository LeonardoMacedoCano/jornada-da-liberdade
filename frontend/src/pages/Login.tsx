import { useState } from 'react'
import styled from 'styled-components'
import { GoogleSignInButton } from 'lcano-react-ui'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { translateApiError } from '../i18n'

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  background: ${p => p.theme.colors.primary};
`

const Wrapper = styled.div`
  width: 100%;
  max-width: 448px;
  animation: fadeIn 0.3s ease-out;
`

const Hero = styled.div`
  text-align: center;
  margin-bottom: 32px;
`

const HeroIcon = styled.div`
  font-size: 56px;
  margin-bottom: 16px;
`

const HeroTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${p => p.theme.colors.white};
`

const HeroSub = styled.p`
  color: ${p => p.theme.colors.gray};
  margin-top: 8px;
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
`

const CardTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${p => p.theme.colors.white};
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

export default function Login() {
  const { loginWithGoogle, googleClientId } = useAuth()
  const { t } = useTranslation()
  const [error, setError] = useState('')

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
          <HeroIcon>💎</HeroIcon>
          <HeroTitle>{t('auth.login.heroTitle')}</HeroTitle>
          <HeroSub>{t('auth.login.heroSub')}</HeroSub>
        </Hero>
        <Card>
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
      </Wrapper>
    </Page>
  )
}
