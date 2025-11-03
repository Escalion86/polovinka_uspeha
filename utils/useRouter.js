'use client'

import { useMemo } from 'react'
import {
  usePathname,
  useRouter as useNextRouter,
  useSearchParams,
} from 'next/navigation'

const createQueryObject = (searchParams) => {
  if (!searchParams) return {}
  const query = {}
  for (const [key, value] of searchParams.entries()) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      const current = query[key]
      if (Array.isArray(current)) {
        current.push(value)
      } else {
        query[key] = [current, value]
      }
    } else {
      query[key] = value
    }
  }
  return query
}

const buildUrl = (input) => {
  if (!input) return ''
  if (typeof input === 'string') return input

  const { pathname = '', query = {} } = input
  const searchParams = new URLSearchParams()
  Object.entries(query).forEach(([key, rawValue]) => {
    if (rawValue == null) return
    const value = Array.isArray(rawValue) ? rawValue : [rawValue]
    value.forEach((item) => {
      if (typeof item !== 'undefined') {
        searchParams.append(key, String(item))
      }
    })
  })

  const search = searchParams.toString()
  return search ? `${pathname}?${search}` : pathname
}

const adaptNavigate = (navigate) => (href, as, options = {}) => {
  const target = typeof href === 'object' ? href : href ?? as
  const url = buildUrl(target)
  if (!url) return
  const { shallow, ...rest } = options ?? {}
  navigate(url, rest)
}

export default function useRouter() {
  const router = useNextRouter()
  const pathname = usePathname() ?? ''
  const searchParams = useSearchParams()

  const query = useMemo(() => createQueryObject(searchParams), [searchParams])

  const asPath = useMemo(() => {
    const search = searchParams?.toString() ?? ''
    return search ? `${pathname}?${search}` : pathname
  }, [pathname, searchParams])

  return useMemo(
    () => ({
      ...router,
      push: adaptNavigate(router.push),
      replace: adaptNavigate(router.replace),
      prefetch: (href, options) => {
        const url = buildUrl(href)
        return url ? router.prefetch(url, options) : Promise.resolve()
      },
      pathname,
      asPath,
      query,
    }),
    [router, pathname, asPath, query]
  )
}
