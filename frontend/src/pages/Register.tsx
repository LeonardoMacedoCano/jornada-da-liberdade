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
  background: ${p => p.theme.colors.warning}1a;
  border: 1px solid ${p => p.theme.colors.warning}4d;
  color: ${p => p.theme.colors.warning};
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
  color: ${p => p.theme.colors.gray};
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

  &::placeholder { color: ${p => p.theme.colors.gray}60; }
  &:focus { border-color: ${p => p.theme.colors.quaternary}; }
`

const Hint = styled.p`
  font-size: 12px;
  color: ${p => p.theme.colors.gray}99;
  margin-top: 4px;
`

const Footer = styled.p`
  text-align: center;
  color: ${p => p.theme.colors.gray};
  font-size: 14px;
  margin-top: 24px;
`

const FooterLink = styled(Link)`
  color: ${p => p.theme.colors.quaternary};
  text-decoration: none;

  &:hover { color: ${p => p.theme.colors.quaternary}cc; }
`

export default function Register() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!/^[a-z0-9-]+$/.test(username)) {
      setError('Username deve conter apenas letras minúsculas, números e hífens')
      return
    }
    setLoading(true)
    try {
      await register(name, email, password, username)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page>
      <Wrapper>
        <Hero>
          <HeroIcon>🌱</HeroIcon>
          <HeroTitle>Começar a Jornada</HeroTitle>
          <HeroSub>Crie sua conta e comece na Fase 0</HeroSub>
        </Hero>
        <Card>
          <CardTitle>Criar conta</CardTitle>
          {error && <ErrorBox>{error}</ErrorBox>}
          <Form onSubmit={handleSubmit}>
            <Field>
              <Label>Nome</Label>
              <Input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Seu nome"
              />
            </Field>
            <Field>
              <Label>Username <span style={{ color: `inherit`, opacity: 0.5 }}>(perfil público)</span></Label>
              <Input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase())}
                required
                placeholder="joao-silva"
              />
              <Hint>Apenas minúsculas, números e hífens. Ex: joao-silva</Hint>
            </Field>
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
                minLength={6}
                placeholder="Mínimo 6 caracteres"
              />
            </Field>
            <Button
              type="submit"
              variant="quaternary"
              width="100%"
              description={loading ? 'Criando conta...' : 'Iniciar Jornada'}
              disabled={loading}
              style={{ borderRadius: '8px', padding: '12px 16px', fontSize: '14px', fontWeight: '600' }}
            />
          </Form>
          <Footer>
            Já tem conta?{' '}
            <FooterLink to="/login">Entrar</FooterLink>
          </Footer>
        </Card>
      </Wrapper>
    </Page>
  )
}
