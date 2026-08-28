import { useState, useEffect, FormEvent } from 'react'
import styled from 'styled-components'
import { Button, ThemeSelector, useMessage } from 'lcano-react-ui'
import { useAuth } from '../contexts/AuthContext'
import { useThemeControl } from '../contexts/ThemeControlContext'
import { translateApiError, interpolate } from '../i18n'
import strings from '../i18n/strings'
import { THEMES } from '../theme'
import api, { extractApiErrorData } from '../services/api'

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

const Warning = styled.p`
  font-size: 12px;
  color: ${p => p.theme.colors.warning};
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
      <ToggleTrack
        role="switch"
        aria-checked={value}
        aria-label={label}
        tabIndex={0}
        $on={value}
        onClick={() => onChange(!value)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(!value) } }}
      >
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
  const [annualReturnRate, setAnnualReturnRate] = useState('11')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingFinancial, setSavingFinancial] = useState(false)
  const { themeId, setThemeId } = useThemeControl()

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
      await api.put('/user/settings', { name, username, sharePublicProfile, showFinancialValues })
      await refreshUser()
      showSuccess(strings.settings.profileSaved)
    } catch (err: unknown) {
      showError(translateApiError(extractApiErrorData(err), strings.settings.errorSave))
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleFinancialSave(e: FormEvent) {
    e.preventDefault()
    setSavingFinancial(true)
    try {
      await api.put('/user/progress', { annualReturnRate: parseFloat(annualReturnRate) || 11 })
      showSuccess(strings.settings.financialSettingsSaved)
    } catch (err: unknown) {
      showError(translateApiError(extractApiErrorData(err), strings.settings.errorFinancialSettings))
    } finally {
      setSavingFinancial(false)
    }
  }

  return (
    <Page>
      <PageHeader>
        <Title>{strings.settings.title}</Title>
        <Subtitle>{strings.settings.subtitle}</Subtitle>
      </PageHeader>

      <Card>
        <CardTitle>{strings.settings.profile}</CardTitle>
        <Form onSubmit={handleProfileSave}>
          <Field>
            <Label>{strings.settings.name}</Label>
            <Input type="text" value={name} onChange={e => setName(e.target.value)} />
          </Field>
          <Field>
            <Label>{strings.settings.username}</Label>
            <Input type="text" value={username} onChange={e => setUsername(e.target.value.toLowerCase())} />
            <Hint>{interpolate(strings.settings.publicProfileUrl, { username })}</Hint>
          </Field>
          <Field>
            <Label>{strings.settings.email} <span style={{ opacity: 0.5 }}>{strings.settings.readOnly}</span></Label>
            <Input type="email" value={user?.email || ''} readOnly $readOnly />
          </Field>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
            <Toggle
              value={sharePublicProfile}
              onChange={setSharePublicProfile}
              label={strings.settings.publicProfileActive}
              hint={interpolate(strings.settings.publicProfileHint, { username })}
            />
            <Toggle
              value={showFinancialValues}
              onChange={setShowFinancialValues}
              label={strings.settings.showFinancialValues}
              hint={strings.settings.showFinancialValuesHint}
            />
          </div>

          <Button
            type="submit"
            variant="quaternary"
            description={savingProfile ? strings.settings.savingProfile : strings.settings.saveProfile}
            disabled={savingProfile}
            style={{ borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600' }}
          />
        </Form>
      </Card>

      <Card>
        <CardTitle>{strings.settings.appearance}</CardTitle>
        <Hint>{strings.settings.appearanceHint}</Hint>
        <ThemeSelector
          value={themeId}
          onChange={setThemeId}
          options={THEMES.map(t => ({
            id: t.id,
            title: t.title,
            swatch: [t.primaryColor, t.secondaryColor, t.tertiaryColor, t.quaternaryColor],
          }))}
        />
      </Card>

      <Card>
        <CardTitle>{strings.settings.financialSettings}</CardTitle>
        <Form onSubmit={handleFinancialSave}>
          <Field>
            <Label>{strings.settings.annualReturnRate}</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={annualReturnRate}
              onChange={e => setAnnualReturnRate(e.target.value)}
            />
            <Hint>{strings.settings.financialSettingsHint}</Hint>
            {(parseFloat(annualReturnRate) || 0) > 15 && (
              <Warning>{strings.settings.annualReturnRateWarning}</Warning>
            )}
          </Field>
          <Button
            type="submit"
            variant="quaternary"
            description={savingFinancial ? strings.settings.savingProfile : strings.settings.saveFinancialSettings}
            disabled={savingFinancial}
            style={{ borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600' }}
          />
        </Form>
      </Card>

    </Page>
  )
}
