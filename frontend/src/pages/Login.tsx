import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from 'lcano-react-ui'
import { useAuth } from '../contexts/AuthContext'

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
`

const CardTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${p => p.theme.colors.white};
  margin-bottom: 24px;
`

const ErrorBox = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  font-size: 14px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Label = styled.label`
  font-size: 14px;
  color: #9ca3af;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
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

const Footer = styled.p`
  text-align: center;
  color: ${p => p.theme.colors.gray};
  font-size: 14px;
  margin-top: 24px;
`

const FooterLink = styled(Link)`
  color: #a78bfa;
  text-decoration: none;

  &:hover { color: #c4b5fd; }
`

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page>
      <Wrapper>
        <Hero>
          <HeroIcon>💎</HeroIcon>
          <HeroTitle>Jornada da Liberdade</HeroTitle>
          <HeroSub>Sua jornada rumo à independência financeira</HeroSub>
        </Hero>
        <Card>
          <CardTitle>Entrar</CardTitle>
          {error && <ErrorBox>{error}</ErrorBox>}
          <Form onSubmit={handleSubmit}>
            <Field>
              <Label>E-mail</Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
              />
            </Field>
            <Field>
              <Label>Senha</Label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </Field>
            <Button
              type="submit"
              variant="quaternary"
              width="100%"
              description={loading ? 'Entrando...' : 'Entrar'}
              disabled={loading}
              style={{ borderRadius: '8px', padding: '12px 16px', fontSize: '14px', fontWeight: '600' }}
            />
          </Form>
          <Footer>
            Não tem conta?{' '}
            <FooterLink to="/register">Criar conta</FooterLink>
          </Footer>
        </Card>
      </Wrapper>
    </Page>
  )
}
