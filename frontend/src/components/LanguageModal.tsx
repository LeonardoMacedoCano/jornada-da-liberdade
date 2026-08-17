import { useState } from 'react'
import styled from 'styled-components'
import { Modal, Button } from 'lcano-react-ui'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES, SupportedLanguage, DEFAULT_LANGUAGE } from '../i18n'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const LANGUAGE_LABELS: Record<SupportedLanguage, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇺🇸' },
  'pt-BR': { name: 'Português (Brasil)', flag: '🇧🇷' },
}

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Option = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  color: ${p => p.theme.colors.white};
  background: ${p => p.$selected ? `${p.theme.colors.quaternary}1a` : `${p.theme.colors.white}08`};
  border: 1px solid ${p => p.$selected ? p.theme.colors.quaternary : p.theme.colors.tertiary};
  transition: border-color 0.15s;
`

const Flag = styled.span`
  font-size: 20px;
`

export default function LanguageModal() {
  const { i18n, t } = useTranslation()
  const { refreshUser } = useAuth()
  const [selected, setSelected] = useState<SupportedLanguage>(DEFAULT_LANGUAGE)
  const [saving, setSaving] = useState(false)

  async function handleConfirm() {
    setSaving(true)
    try {
      await api.put('/user/settings', { language: selected })
      localStorage.setItem('language', selected)
      await i18n.changeLanguage(selected)
      await refreshUser()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      isOpen
      title={t('languageModal.title')}
      showCloseButton={false}
      onClose={() => {}}
      content={
        <div>
          <p style={{ marginBottom: 16, fontSize: 14 }}>{t('languageModal.subtitle')}</p>
          <OptionList>
            {SUPPORTED_LANGUAGES.map(lang => (
              <Option
                key={lang}
                type="button"
                $selected={selected === lang}
                onClick={() => setSelected(lang)}
              >
                <Flag>{LANGUAGE_LABELS[lang].flag}</Flag>
                {LANGUAGE_LABELS[lang].name}
              </Option>
            ))}
          </OptionList>
        </div>
      }
      actions={
        <Button
          variant="quaternary"
          width="100%"
          description={saving ? '...' : t('languageModal.confirm')}
          disabled={saving}
          onClick={handleConfirm}
          style={{ borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600' }}
        />
      }
    />
  )
}
