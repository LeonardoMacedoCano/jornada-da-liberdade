import { useState } from 'react'
import { Button } from 'lcano-react-ui'
import { useTranslation } from 'react-i18next'

interface ShareButtonProps {
  username: string
}

export default function ShareButton({ username }: ShareButtonProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const url = `${window.location.origin}/p/${username}`

  function handleCopy() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="quaternary"
      description={copied ? t('shareButton.copied') : t('shareButton.share')}
      onClick={handleCopy}
      style={{ borderRadius: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: '500' }}
    />
  )
}
