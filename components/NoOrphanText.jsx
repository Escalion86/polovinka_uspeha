import PropTypes from 'prop-types'

const NBSP = '\u00A0'
const SHORT_WORD_RE = /(^|[\s\u00A0])([A-Za-zА-Яа-яЁё]{1,3})([ \t\u00A0]+)/g
const TAG_SPLIT_RE = /(<[^>]+>)/g

export const fixNoOrphanText = (text) =>
  String(text)
    .replace(/&nbsp;/gi, NBSP)
    .replace(SHORT_WORD_RE, (_, prefix, word) => `${prefix}${word}${NBSP}`)

export const fixNoOrphanHtml = (html) =>
  String(html)
    .replace(/&nbsp;/gi, NBSP)
    .split(TAG_SPLIT_RE)
    .map((part) => (part.startsWith('<') ? part : fixNoOrphanText(part)))
    .join('')

const NoOrphanText = ({ as: Component = 'span', text, html, className }) => {
  if (html !== undefined && html !== null) {
    return (
      <Component
        className={className}
        dangerouslySetInnerHTML={{ __html: fixNoOrphanHtml(html) }}
      />
    )
  }

  if (text === undefined || text === null) return null

  return <Component className={className}>{fixNoOrphanText(text)}</Component>
}

NoOrphanText.propTypes = {
  as: PropTypes.elementType,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  html: PropTypes.string,
  className: PropTypes.string,
}

export default NoOrphanText
