'use client'

import { LOCATIONS_KEYS } from '@server/serverConstants'
import { useEffect } from 'react'

const guessLocationFromPath = () => {
  if (typeof window === 'undefined') return null
  const pathname = window.location?.pathname ?? ''
  const [, firstSegment] = pathname.split('/')
  if (firstSegment && LOCATIONS_KEYS.includes(firstSegment)) {
    return firstSegment
  }
  return null
}

const safeErrorMessage = (error) =>
  error instanceof Error ? error.message || 'Unknown error' : String(error || '')

export default function Error({ error, reset }) {
  useEffect(() => {
    const location = guessLocationFromPath()
    if (!location) return

    const payload = {
      location,
      error: {
        message: safeErrorMessage(error),
        stack: error?.stack || '',
        componentStack: error?.digest ? `digest: ${error.digest}` : '',
        url: typeof window !== 'undefined' ? window.location?.href || '' : '',
        userAgent:
          typeof navigator !== 'undefined' ? navigator.userAgent || '' : '',
      },
      meta: {
        type: 'next_error_boundary',
        timestamp: new Date().toISOString(),
      },
    }

    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {})
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="w-full max-w-xl p-5 bg-white border border-gray-300 rounded-lg shadow-sm">
        <div className="mb-2 text-lg font-bold text-general">
          Страница временно недоступна
        </div>
        <p className="mb-4 text-sm text-gray-700">
          Произошла ошибка при загрузке интерфейса. Мы уже записали технический
          отчёт.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 text-sm font-semibold text-white rounded bg-general hover:opacity-90"
          >
            Повторить
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Перезагрузить страницу
          </button>
        </div>
      </div>
    </div>
  )
}

