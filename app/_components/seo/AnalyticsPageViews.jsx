'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'

const getCurrentPath = (pathname, searchParams) => {
  const queryString = searchParams?.toString()
  return queryString ? `${pathname}?${queryString}` : pathname
}

export default function AnalyticsPageViews({
  googleAnalyticsId,
  yandexMetrikaId,
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstView = useRef(true)

  useEffect(() => {
    if (!pathname) return

    if (isFirstView.current) {
      isFirstView.current = false
      return
    }

    const path = getCurrentPath(pathname, searchParams)
    const url = `${window.location.origin}${path}`

    if (googleAnalyticsId && typeof window.gtag === 'function') {
      window.gtag('config', googleAnalyticsId, {
        page_path: path,
        page_location: url,
      })
    }

    if (yandexMetrikaId && typeof window.ym === 'function') {
      window.ym(Number(yandexMetrikaId), 'hit', url)
    }
  }, [googleAnalyticsId, pathname, searchParams, yandexMetrikaId])

  return null
}

AnalyticsPageViews.propTypes = {
  googleAnalyticsId: PropTypes.string,
  yandexMetrikaId: PropTypes.string,
}

AnalyticsPageViews.defaultProps = {
  googleAnalyticsId: '',
  yandexMetrikaId: '',
}
