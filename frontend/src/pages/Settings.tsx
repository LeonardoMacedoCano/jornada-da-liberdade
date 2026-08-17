import { useState, useEffect, FormEvent } from 'react'
import styled from 'styled-components'
import { Button, useMessage } from 'lcano-react-ui'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../i18n'
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
  color: ${p => p.theme.colors.gray};
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

  &::placeholder { color: ${p => p.theme.colors.gray}60; }
  &:focus { border-color: ${p => p.$readOnly ? p.theme.colors.tertiary : p.theme.colors.quaternary}; }
`

const Hint = styled.p`
  font-size: 12px;
  color: ${p => p.theme.colors.gray}99;
  margin-top: 2px;
`

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  background: ${p => p.theme.colors.primary};
  border: 1px solid ${p => p.theme.colors.tertiary};
  color: ${p => p.theme.colors.white};
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  cursor: pointer;

  &:focus { border-color: ${p => p.theme.colors.quaternary}; }
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
  background: ${p => p.$on ? p.theme.colors.quaternary : p.theme.colors.tertiary};
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

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  'pt-BR': 'Português (Brasil)',
}

export default function Settings() {
  const { user, refreshUser } = useAuth()
  const { t, i18n } = useTranslation()
  const { showSuccess, showError } = useMessage()
  const [name, setName] = useState(user?.name || '')
  const [username, setUsername] = useState(user?.username || '')
  const [sharePublicProfile, setSharePublicProfile] = useState(user?.sharePublicProfile ?? true)
  const [showFinancialValues, setShowFinancialValues] = useState(user?.showFinancialValues ?? false)
  const [language, setLanguage] = useState<SupportedLanguage>((user?.language as SupportedLanguage) || 'en')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [annualReturnRate, setAnnualReturnRate] = useState('11')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [savingFinancial, setSavingFinancial] = useState(false)

  useEffect(() => {
    api.get('/user/profile').then(res => {
      const rate = res.data.progress?.annualReturnRate
      if (rate !== undefined) setAnnualReturnRate(parseFloat(rate).toString())
    })
  }, [])

  async function handleProfileSave(e: FormEvent) {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await api.put('/user/settings', { name, username, sharePublicProfile, showFinancialValues, language })
      await refreshUser()
      await i18n.changeLanguage(language)
      localStorage.setItem('language', language)
      showSuccess(t('settings.profileSaved'))
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      showError(msg || t('settings.errorSave'))
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePasswordSave(e: FormEvent) {
    e.preventDefault()
    setSavingPassword(true)
    try {
      await api.put('/user/password', { currentPassword, newPassword })
      showSuccess(t('settings.passwordChanged'))
      setCurrentPassword('')
      setNewPassword('')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      showError(msg || t('settings.errorPassword'))
    } finally {
      setSavingPassword(false)
    }
  }

  async function handleFinancialSave(e: FormEvent) {
    e.preventDefault()
    setSavingFinancial(true)
    try {
      await api.put('/user/progress', { annualReturnRate: parseFloat(annualReturnRate) || 11 })
      showSuccess(t('settings.financialSettingsSaved'))
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      showError(msg || t('settings.errorFinancialSettings'))
    } finally {
      setSavingFinancial(false)
    }
  }

  return (
    <Page>
      <PageHeader>
        <Title>{t('settings.title')}</Title>
        <Subtitle>{t('settings.subtitle')}</Subtitle>
      </PageHeader>

      <Card>
        <CardTitle>{t('settings.profile')}</CardTitle>
        <Form onSubmit={handleProfileSave}>
          <Field>
            <Label>{t('settings.name')}</Label>
            <Input type="text" value={name} onChange={e => setName(e.target.value)} />
          </Field>
          <Field>
            <Label>{t('settings.username')}</Label>
            <Input type="text" value={username} onChange={e => setUsername(e.target.value.toLowerCase())} />
            <Hint>{t('settings.publicProfileUrl', { username })}</Hint>
          </Field>
          <Field>
            <Label>{t('settings.email')} <span style={{ opacity: 0.5 }}>{t('settings.readOnly')}</span></Label>
            <Input type="email" value={user?.email || ''} readOnly $readOnly />
          </Field>
          <Field>
            <Label>{t('settings.language')}</Label>
            <Select value={language} onChange={e => setLanguage(e.target.value as SupportedLanguage)}>
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{LANGUAGE_NAMES[lang]}</option>
              ))}
            </Select>
            <Hint>{t('settings.languageHint')}</Hint>
          </Field>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
            <Toggle
              value={sharePublicProfile}
              onChange={setSharePublicProfile}
              label={t('settings.publicProfileActive')}
              hint={t('settings.publicProfileHint', { username })}
            />
            <Toggle
              value={showFinancialValues}
              onChange={setShowFinancialValues}
              label={t('settings.showFinancialValues')}
              hint={t('settings.showFinancialValuesHint')}
            />
          </div>

          <Button
            type="submit"
            variant="quaternary"
            description={savingProfile ? t('settings.savingProfile') : t('settings.saveProfile')}
            disabled={savingProfile}
            style={{ borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600' }}
          />
        </Form>
      </Card>

      <Card>
        <CardTitle>{t('settings.financialSettings')}</CardTitle>
        <Form onSubmit={handleFinancialSave}>
          <Field>
            <Label>{t('settings.annualReturnRate')}</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={annualReturnRate}
              onChange={e => setAnnualReturnRate(e.target.value)}
            />
            <Hint>{t('settings.financialSettingsHint')}</Hint>
          </Field>
          <Button
            type="submit"
            variant="quaternary"
            description={savingFinancial ? t('settings.savingProfile') : t('settings.saveFinancialSettings')}
            disabled={savingFinancial}
            style={{ borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600' }}
          />
        </Form>
      </Card>

      <Card>
        <CardTitle>{t('settings.changePassword')}</CardTitle>
        <Form onSubmit={handlePasswordSave}>
          <Field>
            <Label>{t('settings.currentPassword')}</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </Field>
          <Field>
            <Label>{t('settings.newPassword')}</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder={t('settings.newPasswordHint')}
            />
          </Field>
          <Button
            type="submit"
            variant="quaternary"
            description={savingPassword ? t('settings.savingPassword') : t('settings.savePassword')}
            disabled={savingPassword}
            style={{ borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600' }}
          />
        </Form>
      </Card>

    </Page>
  )
}
