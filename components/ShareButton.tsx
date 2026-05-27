'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

interface Props {
  slug: string
}

export default function ShareButton({ slug }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = `${window.location.origin}/audit/${slug}?ref=${slug}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      window.prompt('Copy this link to share your audit:', url)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Link copied' : 'Copy shareable link'}
      className="ui-btn-secondary w-full h-10 gap-2"
    >
      {copied ? (
        <>
          <Check size={14} />
          Copied
        </>
      ) : (
        <>
          <Link2 size={14} />
          Copy share link
        </>
      )}
    </button>
  )
}
