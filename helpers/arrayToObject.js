export const arrayToObjectArray = (
  array,
  key,
  noDeleteKey,
  keyNameIfNull,
  func = (a) => a
) => {
  const tempObject = {}
  array.forEach((el) => {
    const tempEl = { ...el }
    if (!noDeleteKey) delete tempEl[key]
    const actualKey = el[key] ?? keyNameIfNull
    if (!tempObject[actualKey]) tempObject[actualKey] = []
    tempObject[actualKey].push(func(tempEl))
  })
  return tempObject
}

const arrayToObject = (array, key, noDeleteKey, keyNameIfNull) => {
  const tempObject = {}
  array.forEach((el) => {
    const tempEl = { ...el }
    if (!noDeleteKey) delete tempEl[key]
    tempObject[el[key] ?? keyNameIfNull] = tempEl
  })
  return tempObject
}

export default arrayToObject
