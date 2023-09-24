import DOMPurify from 'dompurify'

const sanitizeConf = {
  ALLOWED_TAGS: [
    'b',
    'br',
    'i',
    'em',
    's',
    'strong',
    'a',
    'p',
    'u',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'div',
    'font',
    'strike',
    'sub',
    'sup',
    'span',
    'blockquote',
    'ol',
    'li',
    'ul',
  ],
  ALLOWED_ATTR: ['style', 'class', 'href', 'rel', 'target', 'size'],
}

const sanitize = (html) =>
  DOMPurify.sanitize(html, sanitizeConf).replaceAll('<br />', '<br>')

export default sanitize
