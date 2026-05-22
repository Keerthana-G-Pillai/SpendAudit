'use client'

import { useState } from 'react'

interface Props {
  slug: string
}

export default function ShareButton({ slug }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = `${window.location.origin}/audit/${slug}`
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
      aria-label={copied ? 'Audit link copied' : 'Copy shareable audit link'}
      className="w-full min-h-[48px] border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
    >
      {copied ? (
        <>
          <span aria-hidden="true">✓</span>
          <span>Link copied to clipboard</span>
        </>
      ) : (
        <>
          <span aria-hidden="true">↗</span>
          <span>Share this audit</span>
        </>
      )}
    </button>
  )
}
