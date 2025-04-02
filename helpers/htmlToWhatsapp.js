function htmlToWhatsapp(htmlText) {
  let markdown = (htmlText || '')
    // 0. Замена символов влияющих на форматирование
    // .replaceAll('-', '—')
    .replaceAll('*', '⚹')
    // 1. Замена HTML-сущностей
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')

    // 2. Обработка переносов строк
    .replace(/<\/p><p><br><\/p><p><br><\/p><p>/gi, '\n\n\n')
    .replace(/<\/p><p><br><\/p><p>/gi, '\n\n')
    .replace(/<p><br><\/p>/gi, '\n')
    .replace(/<br><p>/gi, '\n')

    .replace(/<br\s*\/?>/gi, '\n') // <br> → перенос
    .replace(/<\/p><p>/gi, '\n') // </p> → перенос
    .replace(/<\/p>/gi, '\n') // </p> → перенос
    .replace(/<p>/gi, '\n')
    .replace(/<ol\b[^>]*>[\s\S]*?<\/ol>/gi, (olBlock) => {
      let counter = 1
      return olBlock
        .replace(
          /<li\b[^>]*data-list="ordered"[^>]*>[\s\S]*?<\/li>/gi,
          (liTag) => `${counter++}. ${liTag.trim()}\n`
        )
        .replace(/<\/?ol[^>]*>/g, '') // Удаляем оставшиеся теги списка
        .trim()
    })
    .replace(/<li data-list="bullet">/gi, '❤️ ')
    .replace(/<\/li>/gi, '\n')

    // Обработка пробелов вокруг открывающих тегов
    .replace(
      /(\s*)<(b|strong)>(\s*)(.*?)(\s*)<\/\2>(\s*)/gi,
      (_, before, tag, wsOpen, content, wsClose, after) => {
        return `${before + wsOpen || ' '}*${content.trim()}*${wsClose + after || ' '}`
      }
    )
    .replace(
      /(\s*)<(i|em)>(\s*)(.*?)(\s*)<\/\2>(\s*)/gi,
      (_, before, tag, wsOpen, content, wsClose, after) => {
        return `${before + wsOpen || ' '}_${content.trim()}_${wsClose + after || ' '}`
      }
    )
    .replace(
      /(\s*)<(s|del|strike)>(\s*)(.*?)(\s*)<\/\2>(\s*)/gi,
      (_, before, tag, wsOpen, content, wsClose, after) => {
        return `${before + wsOpen || ' '}~${content.trim()}~${wsClose + after || ' '}`
      }
    )

    // 3. Обработка форматирования
    // .replace(/\s<(b|strong)>(.*?)<\/\1>/gi, '*$2* ')
    // .replace(/<(b|strong)>(.*?)<\/\1>/gi, '*$2*')
    // .replace(/<(i|em)>(.*?)<\/\1>/gi, '_$2_')
    // .replace(/<(s|del)>(.*?)<\/\1>/gi, '~$2~')

    // 4. Удаление HTML-тегов (сохраняем пробелы)
    .replace(/<[^>]+>/g, '')

    // 5. Чистка пробелов (БЕЗ УДАЛЕНИЯ ПЕРЕНОСОВ)
    // console.log('1', JSON.stringify({ markdown }))
    // markdown = markdown
    // .replace(/[ \t]+/g, ' ') // Схлопываем пробелы и табы
    .replace(/ +(\n)/g, '$1') // Убираем пробелы перед переносами
    .replace(/(\n) +/g, '$1') // Убираем пробелы после переносов
    // .replace(/(\*|_|~) /g, '$1') // Пробелы после форматирования
    // .replace(/ (\*|_|~)/g, '$1') // Пробелы перед форматированием

    // 6. Нормализация переносов
    .replace(/\n{4,}/g, '\n\n\n') // Максимум 3 переноса подряд
    .trim()
  return markdown
}

export default htmlToWhatsapp
