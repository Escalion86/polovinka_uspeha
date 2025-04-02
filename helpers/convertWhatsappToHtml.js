function convertWhatsappToHtml(text) {
  return text
    .replace(/~([^~]+)~/g, '<s>$1</s>')
    .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replaceAll('\n', '<br>')
}

export default convertWhatsappToHtml
