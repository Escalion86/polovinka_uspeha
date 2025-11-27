import DOMPurify from 'isomorphic-dompurify'

const convertHtmlToTelegramText = (html = '') => {
  if (!html) return ''

  const normalized = html
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')

  const sanitized = DOMPurify.sanitize(normalized, {
    ALLOWED_TAGS: [
      'b',
      'strong',
      'i',
      'em',
      'u',
      'ins',
      's',
      'strike',
      'del',
      'code',
      'pre',
      'a',
    ],
    ALLOWED_ATTR: ['href'],
  })

  return sanitized
    .replace(/&nbsp;/gi, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export default convertHtmlToTelegramText
