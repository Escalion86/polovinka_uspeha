import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on'])
const KNOWN_LOCATIONS = new Set(['krsk', 'nrsk', 'ekb'])
const DEVLOGIN_BYPASS_COOKIE = 'devlogin_bypass'
const AUTH_JWT_SECRET = process.env.SECRET || 'test'

const parseBooleanEnv = (value) => {
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return false
  return TRUE_VALUES.has(value.trim().toLowerCase())
}
const isProxyDebugEnabled = () => parseBooleanEnv(process.env.DEBUG_PROXY)

const normalizePhone = (value) => {
  if (value === null || value === undefined) return null
  const digits = String(value).replace(/\D/g, '')
  if (!digits) return null
  if (digits.length === 10) return `7${digits}`
  if (digits.length === 11 && digits[0] === '8') return `7${digits.slice(1)}`
  return digits
}

const getAllowedPhones = () => {
  const raw = process.env.AUTH_DEV_ONLY_ALLOW_PHONES || ''
  if (!raw) return new Set()
  return new Set(
    raw
      .split(',')
      .map((item) => normalizePhone(item))
      .filter(Boolean)
  )
}

const isPathLocationScoped = (pathname) => {
  const firstSegment = pathname.split('/').filter(Boolean)[0]
  return KNOWN_LOCATIONS.has(firstSegment)
}
const getLocationFromPath = (pathname) => {
  const firstSegment = pathname.split('/').filter(Boolean)[0]
  return KNOWN_LOCATIONS.has(firstSegment) ? firstSegment : null
}

const isPathAllowedWithoutAuth = (pathname) => {
  if (pathname === '/') return true
  if (pathname === '/maintenance') return true
  if (/^\/(?:krsk|nrsk|ekb)\/logindev(?:\/|$)/.test(pathname)) return true

  const parts = pathname.split('/').filter(Boolean)
  if (parts.length >= 2 && KNOWN_LOCATIONS.has(parts[0])) {
    if (parts[1] === 'maintenance' || parts[1] === 'logindev') return true
  }
  return false
}

const isCabinetPath = (pathname) => {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] === 'cabinet') return true
  return parts.length >= 2 && KNOWN_LOCATIONS.has(parts[0]) && parts[1] === 'cabinet'
}

const isDevAccessToken = (token) => {
  if (!token) return false
  const tokenRole = token?.role || token?.user?.role
  if (tokenRole === 'dev') return true

  const allowedPhones = getAllowedPhones()
  if (allowedPhones.size === 0) return false

  const tokenPhone = normalizePhone(token?.phone || token?.user?.phone)
  return Boolean(tokenPhone && allowedPhones.has(tokenPhone))
}

export async function proxy(req) {
  const { pathname } = req.nextUrl

  // Hard allow for developer login route in maintenance mode
  if (pathname.includes('/logindev')) {
    const response = NextResponse.next()
    response.cookies.set(DEVLOGIN_BYPASS_COOKIE, '1', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 10 * 60,
    })
    if (isProxyDebugEnabled()) {
      console.log('[proxy] allow logindev path:', pathname)
    }
    return response
  }

  const authDevOnlyMode = parseBooleanEnv(process.env.AUTH_DEV_ONLY_MODE)

  if (!authDevOnlyMode) {
    const token = await getToken({ req, secret: AUTH_JWT_SECRET })
    if (token && !isCabinetPath(pathname)) {
      const tokenLocation =
        typeof token?.location === 'string' && KNOWN_LOCATIONS.has(token.location)
          ? token.location
          : null
      const pathLocation = getLocationFromPath(pathname)
      const targetLocation = pathLocation || tokenLocation || 'krsk'
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.search = ''
      redirectUrl.pathname = `/${targetLocation}/cabinet/eventsCalendar`
      if (redirectUrl.pathname !== pathname) {
        return NextResponse.redirect(redirectUrl)
      }
    }
    return NextResponse.next()
  }

  if (isPathAllowedWithoutAuth(pathname)) {
    if (isProxyDebugEnabled()) {
      console.log('[proxy] allow public path:', pathname)
    }
    return NextResponse.next()
  }

  if (isCabinetPath(pathname)) {
    const bypassCookie = req.cookies.get(DEVLOGIN_BYPASS_COOKIE)?.value === '1'
    if (bypassCookie) {
      if (isProxyDebugEnabled()) {
        console.log('[proxy] allow cabinet by logindev bypass cookie:', pathname)
      }
      return NextResponse.next()
    }

    const token = await getToken({ req, secret: AUTH_JWT_SECRET })
    if (isDevAccessToken(token)) {
      if (isProxyDebugEnabled()) {
        console.log('[proxy] allow cabinet for dev token:', pathname)
      }
      return NextResponse.next()
    }
  }

  const redirectUrl = req.nextUrl.clone()
  redirectUrl.search = ''
  redirectUrl.pathname = isPathLocationScoped(pathname)
    ? `/${pathname.split('/').filter(Boolean)[0]}/maintenance`
    : '/maintenance'

  if (isProxyDebugEnabled()) {
    console.log('[proxy] redirect to maintenance:', pathname, '->', redirectUrl.pathname)
  }

  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|service-worker.js|.*\\..*).*)',
  ],
}
