import sanitizeHtml from 'sanitize-html'

const sanitizeConf = {
  allowedTags: [
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
  // selfClosing: ['br'],
  allowedAttributes: {
    a: ['href', 'rel', 'target'],
    div: ['style', 'class'],
    font: ['size'],
    span: ['style', 'class'],
    p: ['style', 'class'],
    h1: ['style', 'class'],
    h2: ['style', 'class'],
    h3: ['style', 'class'],
    h4: ['style', 'class'],
    h5: ['style', 'class'],
    h6: ['style', 'class'],
    li: ['style'],
  },
  // allowedStyles: {
  // '*': {
  // Match HEX and RGB
  // 'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
  // 'text-align': [/^left$/, /^right$/, /^center$/],
  // Match any number with px, em, or %
  // 'font-size': [/^\d+(?:px|em|%)$/]
  // },
  // div: {
  //   // Match HEX and RGB
  //   // 'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
  //   'text-align': [/^left$/, /^right$/, /^center$/],
  //   // Match any number with px, em, or %
  //   // 'font-size': [/^\d+(?:px|em|%)$/]
  // },
  // 'p': {
  //   'font-size': [/^\d+rem$/]
  // }
  // },
}

const sanitize = (html) =>
  sanitizeHtml(html, sanitizeConf).replaceAll('<br />', '<br>')

export default sanitize
