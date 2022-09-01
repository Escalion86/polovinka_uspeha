import sanitizeHtml from 'sanitize-html'

const sanitizeConf = {
  allowedTags: [
    'b',
    'br',
    'i',
    'em',
    'strong',
    // 'a',
    'p',
    'u',
    'h1',
    'div',
    'font',
    'strike',
    'sub',
    'sup',
  ],
  // selfClosing: ['br'],
  allowedAttributes: { a: ['href'], div: ['style'], font: ['size'] },
  allowedStyles: {
    // '*': {
    // Match HEX and RGB
    // 'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
    // 'text-align': [/^left$/, /^right$/, /^center$/],
    // Match any number with px, em, or %
    // 'font-size': [/^\d+(?:px|em|%)$/]
    // },
    div: {
      // Match HEX and RGB
      // 'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
      'text-align': [/^left$/, /^right$/, /^center$/],
      // Match any number with px, em, or %
      // 'font-size': [/^\d+(?:px|em|%)$/]
    },
    // 'p': {
    //   'font-size': [/^\d+rem$/]
    // }
  },
}

const sanitize = (html) =>
  sanitizeHtml(html, sanitizeConf).replaceAll('<br />', '<br>')

export default sanitize
