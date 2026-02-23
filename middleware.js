import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on'])
const KNOWN_LOCATIONS = new Set(['krsk', 'nrsk', 'ekb'])

const parseBooleanEnv = (value) => {
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return false
  return TRUE_VALUES.has(value.trim().toLowerCase())
}

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

const isPathAllowedWithoutAuth = (pathname) => {
  if (pathname === '/') return true
  if (pathname === '/maintenance') return true

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
  if (token.role === 'dev') return true

  const allowedPhones = getAllowedPhones()
  if (allowedPhones.size === 0) return false

  const tokenPhone = normalizePhone(token.phone)
  return Boolean(tokenPhone && allowedPhones.has(tokenPhone))
}

export async function middleware(req) {
  if (!parseBooleanEnv(process.env.AUTH_DEV_ONLY_MODE)) {
    return NextResponse.next()
  }

  const { pathname } = req.nextUrl

  if (isPathAllowedWithoutAuth(pathname)) {
    return NextResponse.next()
  }

  if (isCabinetPath(pathname)) {
    const token = await getToken({ req, secret: process.env.SECRET })
    if (isDevAccessToken(token)) {
      return NextResponse.next()
    }
  }

  const redirectUrl = req.nextUrl.clone()
  redirectUrl.search = ''
  redirectUrl.pathname = isPathLocationScoped(pathname)
    ? `/${pathname.split('/').filter(Boolean)[0]}/maintenance`
    : '/maintenance'

  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|service-worker.js).*)',
  ],
}
