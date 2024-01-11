const arrayToObject = (array, key) => {
  const tepmObject = {}
  array.forEach((el) => {
    const tempEl = { ...el }
    delete tempEl[key]
    tepmObject[el[key]] = tempEl
  })
  return tepmObject
}

export default arrayToObject
