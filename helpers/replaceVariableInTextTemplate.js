function replaceVariableInTextTemplate(str, variables) {
  return str.replace(
    /<em>{(\w+)}{<\/em>(.+?)<em>}{<\/em>(.+?)<em>}<\/em>/g,
    (match, varName, text1, text2) => {
      return typeof variables[varName] === 'boolean'
        ? variables[varName]
          ? text1
          : text2
        : ''
    }
  )
}

export default replaceVariableInTextTemplate
