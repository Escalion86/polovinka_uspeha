function htmlToTelegram(htmlText) {
  let message = (htmlText || '')
    // Декодируем основные HTML-сущности
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/gi, ' ')
    // Переносы строк и списки
    .replace(/<\/p><p><br><\/p><p><br><\/p><p>/gi, '\n\n\n')
    .replace(/<\/p><p><br><\/p><p>/gi, '\n\n')
    .replace(/<p><br><\/p>/gi, '\n')
    .replace(/<br><p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p><p>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p>/gi, '\n')
    .replace(/<ol\b[^>]*>[\s\S]*?<\/ol>/gi, (olBlock) => {
      let counter = 1
      return olBlock
        .replace(
          /<li\b[^>]*data-list="ordered"[^>]*>[\s\S]*?<\/li>/gi,
          (liTag) => `${counter++}. ${liTag.trim()}\n`
        )
        .replace(/<\/?ol[^>]*>/g, '')
        .trim()
    })
    .replace(/<li data-list="bullet">/gi, '\u2022 ')
    .replace(/<\/li>/gi, '\n')
    // Форматирование
    .replace(
      /(\s*)<(b|strong)>(\s*)([\s\S]*?)(\s*)<\/\2>(\s*)/gi,
      (_, before, tag, wsOpen, content, wsClose, after) => {
        return `${before + wsOpen || ' '}<b>${content.trim()}</b>${
          wsClose + after || ' '
        }`
      }
    )
    .replace(
      /(\s*)<(i|em)>(\s*)([\s\S]*?)(\s*)<\/\2>(\s*)/gi,
      (_, before, tag, wsOpen, content, wsClose, after) => {
        return `${before + wsOpen || ' '}<i>${content.trim()}</i>${
          wsClose + after || ' '
        }`
      }
    )
    .replace(
      /(\s*)<(s|del|strike)>(\s*)([\s\S]*?)(\s*)<\/\2>(\s*)/gi,
      (_, before, tag, wsOpen, content, wsClose, after) => {
        return `${before + wsOpen || ' '}<s>${content.trim()}</s>${
          wsClose + after || ' '
        }`
      }
    )
    .replace(
      /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,
      (_, href, text) => `<a href="${href}">${text.trim()}</a>`
    )

  // Удаляем все остальные теги, кроме разрешенных
  message = message.replace(
    /<(?!\/?(b|i|s|a|br)\b)[^>]+>/gi,
    ''
  )

  // Нормализуем переносы строк и пробелы
  return message
    .replace(/ +(\n)/g, '$1')
    .replace(/(\n) +/g, '$1')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim()
}

export default htmlToTelegram
