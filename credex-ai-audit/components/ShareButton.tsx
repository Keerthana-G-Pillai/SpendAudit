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
      // Fallback for browsers that block clipboard API
      prompt('Copy this link to share your audit:', url)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="w-full border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-2"
    >
      {copied ? (
        <>
          <span>✓</span>
          <span>Link copied to clipboard</span>
        </>
      ) : (
        <>
          <span>↗</span>
          <span>Share this audit</span>
        </>
      )}
    </button>
  )
}
