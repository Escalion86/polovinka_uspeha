function extractVariables(str) {
  const variables = new Set()

  const process = (s) => {
    let match
    // Регулярное выражение с поддержкой кириллицы и Unicode-флагом
    const localRegex = /\{([а-яА-ЯёЁa-zA-Z0-9_]+)\}\{(.*?)\}(?:\{(.*?)\})?/gu
    while ((match = localRegex.exec(s)) !== null) {
      const varName = match[1]
      const text1 = match[2]
      const text2 = match[3] || ''

      variables.add(varName)
      process(text1) // Рекурсивно обрабатываем вложенные шаблоны
      process(text2)
    }
  }

  process(str)
  return Array.from(variables)
}

export default extractVariables
