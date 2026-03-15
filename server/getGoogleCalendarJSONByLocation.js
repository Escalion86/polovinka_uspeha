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

  return existingDir || candidates[0] || null
}

const getGoogleCalendarJSONByLocation = (location) => {
  const tokensDir = resolveTokensDir()
  if (!tokensDir) return

  if (location === 'ekb')
    return path.join(tokensDir, 'ekb.json')
  if (location === 'krsk')
    return path.join(tokensDir, 'krsk.json')
  if (location === 'nrsk')
    return path.join(tokensDir, 'nrsk.json')
  else return
}

export default getGoogleCalendarJSONByLocation
