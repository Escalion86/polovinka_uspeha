// function replaceVariableInTextTemplate(str, variables) {
//   return str.replace(
//     /<em>{(\w+)}{<\/em>(.+?)<em>}{<\/em>(.+?)<em>}<\/em>/g,
//     (match, varName, text1, text2) => {
//       return typeof variables[varName] === 'boolean'
//         ? variables[varName]
//           ? text1
//           : text2
//         : ''
//     }
//   )
// }

function replaceVariableInTextTemplate(str, variables) {
  const regex = /\{([а-яА-ЯёЁ\w]+)\}\{(.*?)\}(?:\{(.*?)\})?/gu

  const process = (s) => {
    if (!s) return ''
    let newStr = s.replace(regex, (match, varName, text1, text2) => {
      const value = variables[varName]
      // Если text2 есть, выбираем между text1/text2, иначе text1/пустота
      if (value === undefined) return ''
      return value ? text1 : (text2 ?? '')
    })
    // Рекурсивно обрабатываем вложенные шаблоны
    return newStr === s ? newStr : process(newStr)
  }

  return process(str)
  // const regex = /\{\{(\w+)\}\{(.*?)\}(?:\}\{(.*?)\})?\}\}/g

  // const process = (s) => {
  //   const newStr = s.replace(regex, (match, varName, text1, text2) => {
  //     const value = variables[varName]
  //     return value !== undefined && value ? text1 : (text2 ?? '')
  //   })
  //   console.log('newStr :>> ', newStr)
  //   // Рекурсивная обработка до тех пор, пока есть изменения
  //   return newStr === s ? newStr : process(newStr)
  // }

  // return process(str)
}

export default replaceVariableInTextTemplate
