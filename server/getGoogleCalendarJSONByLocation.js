import path from 'path'
import fs from 'fs'

const resolveTokensDir = () => {
  const envDir = String(process.env.GOOGLE_CALENDAR_TOKENS_DIR || '').trim()
  const candidates = [
    envDir,
    path.join(process.cwd(), 'google_calendar_tokens'),
    path.join(process.cwd(), '..', 'google_calendar_tokens'),
    '/home/apps/polovinka_uspeha/google_calendar_tokens',
  ].filter(Boolean)

  const existingDir = candidates.find((dir) => {
    try {
      return fs.existsSync(dir)
    } catch {
      return false
    }
  })

  console.log('google-calendar tokens dir resolve:', {
    cwd: process.cwd(),
    envDir: envDir || null,
    candidates,
    existingDir: existingDir || null,
  })

  return existingDir || candidates[0] || null
}

const getGoogleCalendarJSONByLocation = (location) => {
  const tokensDir = resolveTokensDir()
  if (!tokensDir) return

  let resolvedPath
  if (location === 'ekb')
    resolvedPath = path.join(tokensDir, 'ekb.json')
  if (location === 'krsk')
    resolvedPath = path.join(tokensDir, 'krsk.json')
  if (location === 'nrsk')
    resolvedPath = path.join(tokensDir, 'nrsk.json')
  if (!resolvedPath) return

  console.log('google-calendar key file resolve:', {
    location,
    resolvedPath,
    exists: fs.existsSync(resolvedPath),
  })

  return resolvedPath
}

export default getGoogleCalendarJSONByLocation
