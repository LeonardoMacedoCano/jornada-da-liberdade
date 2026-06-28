import { useState } from 'react'

interface ShareButtonProps {
  username: string
}

export default function ShareButton({ username }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const url = `${window.location.origin}/p/${username}`

  function handleCopy() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm transition-colors"
    >
      {copied ? '✓ Link copiado!' : '🔗 Compartilhar perfil'}
    </button>
  )
}
