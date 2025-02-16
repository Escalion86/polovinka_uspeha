const convertHtmlToText = (text, type) => {
  var preparedText = text
  if (type === 'telegram') {
    preparedText = text
      .replaceAll('<b>', '**')
      .replaceAll('</b>', '**')
      .replaceAll('<i>', '__')
      .replaceAll('</i>', '__')
      .replaceAll('<s>', '~~')
      .replaceAll('</s>', '~~')
  } else if (type === 'whatsapp') {
    preparedText = text
      .replaceAll('<b>', '*')
      .replaceAll('</b>', '*')
      .replaceAll('<i>', '_')
      .replaceAll('</i>', '_')
      .replaceAll('<s>', '~')
      .replaceAll('</s>', '~')
  } else {
    preparedText = text
      .replaceAll('<b>', '')
      .replaceAll('</b>', '')
      .replaceAll('<i>', '')
      .replaceAll('</i>', '')
      .replaceAll('<s>', '')
      .replaceAll('</s>', '')
  }

  return preparedText
    .replaceAll('<p><br></p>', '\n')
    .replaceAll('<blockquote>', '\n<blockquote>')
    .replaceAll('<li>', '\n\u{2764} <li>')
    .replaceAll('<p>', '\n<p>')
    .replaceAll('<br>', '\n')
    .replaceAll('&nbsp;', ' ')
    .trim('\n')
}

export default convertHtmlToText
