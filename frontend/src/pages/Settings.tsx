import { useState, FormEvent } from 'react'
import styled from 'styled-components'
import { Button, useMessage } from 'lcano-react-ui'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

const Page = styled.div`
  max-width: 672px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
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

const Card = styled.div`
  background: ${p => p.theme.colors.secondary};
  border: 1px solid ${p => p.theme.colors.tertiary};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${p => p.theme.colors.white};
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

const Input = styled.input<{ $readOnly?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  background: ${p => p.theme.colors.primary};
  border: 1px solid ${p => p.theme.colors.tertiary};
  color: ${p => p.theme.colors.white};
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  opacity: ${p => p.$readOnly ? 0.5 : 1};
  cursor: ${p => p.$readOnly ? 'not-allowed' : 'text'};

  &::placeholder { color: #374151; }
  &:focus { border-color: ${p => p.$readOnly ? p.theme.colors.tertiary : p.theme.colors.quaternary}; }
`

const Hint = styled.p`
  font-size: 12px;
  color: #4b5563;
  margin-top: 2px;
`

const ToggleRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
`

const ToggleTrack = styled.div<{ $on: boolean }>`
  flex-shrink: 0;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: ${p => p.$on ? p.theme.colors.quaternary : '#374151'};
  position: relative;
  transition: background 0.2s;
  cursor: pointer;
  margin-top: 2px;
`

const ToggleThumb = styled.div<{ $on: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 4px;
  left: ${p => p.$on ? '24px' : '4px'};
  transition: left 0.2s;
`

const ToggleText = styled.div``

const ToggleLabel = styled.span`
  font-size: 14px;
  color: ${p => p.theme.colors.white};
`

const ToggleHint = styled.p`
  font-size: 12px;
  color: ${p => p.theme.colors.gray};
  margin-top: 2px;
`


function Toggle({
  value,
  onChange,
  label,
  hint,
}: {
  value: boolean
  onChange: (v: boolean) => void
  label: string
  hint: string
}) {
  return (
    <ToggleRow>
      <ToggleTrack $on={value} onClick={() => onChange(!value)}>
        <ToggleThumb $on={value} />
      </ToggleTrack>
      <ToggleText>
        <ToggleLabel>{label}</ToggleLabel>
        <ToggleHint>{hint}</ToggleHint>
      </ToggleText>
    </ToggleRow>
  )
}

export default function Settings() {
  const { user, refreshUser } = useAuth()
  const { showSuccess, showError } = useMessage()
  const [name, setName] = useState(user?.name || '')
  const [username, setUsername] = useState(user?.username || '')
  const [sharePublicProfile, setSharePublicProfile] = useState(user?.sharePublicProfile ?? true)
  const [showFinancialValues, setShowFinancialValues] = useState(user?.showFinancialValues ?? false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  async function handleProfileSave(e: FormEvent) {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await api.put('/user/settings', { name, username, sharePublicProfile, showFinancialValues })
      await refreshUser()
      showSuccess('Perfil atualizado com sucesso!')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      showError(msg || 'Erro ao salvar')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePasswordSave(e: FormEvent) {
    e.preventDefault()
    setSavingPassword(true)
    try {
      await api.put('/user/password', { currentPassword, newPassword })
      showSuccess('Senha alterada com sucesso!')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      showError(msg || 'Erro ao alterar senha')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <Page>
      <PageHeader>
        <Title>Configurações</Title>
        <Subtitle>Gerencie seu perfil e preferências</Subtitle>
      </PageHeader>

      <Card>
        <CardTitle>Perfil</CardTitle>
        <Form onSubmit={handleProfileSave}>
          <Field>
            <Label>Nome</Label>
            <Input type="text" value={name} onChange={e => setName(e.target.value)} />
          </Field>
          <Field>
            <Label>Username</Label>
            <Input type="text" value={username} onChange={e => setUsername(e.target.value.toLowerCase())} />
            <Hint>URL do perfil público: /p/{username}</Hint>
          </Field>
          <Field>
            <Label>E-mail <span style={{ color: '#4b5563' }}>(somente leitura)</span></Label>
            <Input type="email" value={user?.email || ''} readOnly $readOnly />
          </Field>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
            <Toggle
              value={sharePublicProfile}
              onChange={setSharePublicProfile}
              label="Perfil público ativo"
              hint={`Permite que sua página /p/${username} seja acessada`}
            />
            <Toggle
              value={showFinancialValues}
              onChange={setShowFinancialValues}
              label="Mostrar valores financeiros no perfil público"
              hint="Exibe patrimônio e renda passiva para visitantes"
            />
          </div>

          <Button
            type="submit"
            variant="quaternary"
            description={savingProfile ? 'Salvando...' : 'Salvar Perfil'}
            disabled={savingProfile}
            style={{ borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600' }}
          />
        </Form>
      </Card>

      <Card>
        <CardTitle>Alterar Senha</CardTitle>
        <Form onSubmit={handlePasswordSave}>
          <Field>
            <Label>Senha atual</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </Field>
          <Field>
            <Label>Nova senha</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </Field>
          <Button
            type="submit"
            variant="quaternary"
            description={savingPassword ? 'Alterando...' : 'Alterar Senha'}
            disabled={savingPassword}
            style={{ borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600' }}
          />
        </Form>
      </Card>

    </Page>
  )
}
