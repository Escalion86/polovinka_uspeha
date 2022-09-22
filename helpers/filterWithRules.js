const filterWithRules = (items, rules) => {
  if (!rules || typeof rules !== 'object' || Object.entries(rules).length === 0)
    return items

  return [...items].filter((item) => {
    for (const [key, rule] of Object.entries(rules)) {
      const operand = rule?.operand
      const value = rule?.value

      const evalResult = eval(
        (typeof value === 'number' ? item[key] : `'` + item[key] + `'`) +
          operand +
          (typeof value === 'number' ? value : `'` + value + `'`)
      )

      if (!evalResult) return false
    }
    return true
  })
}

export default filterWithRules
