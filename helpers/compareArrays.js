const compareArrays = (arrayOld, arrayNew) => {
  if (
    typeof arrayOld !== 'object' ||
    typeof arrayNew !== 'object' ||
    arrayOld.length !== arrayNew.length
  )
    return false

  for (let i = 0; i < arrayOld.length; i++) {
    if (arrayOld[i] !== arrayNew[i]) {
      return false
    }
  }

  return true
}

export default compareArrays
