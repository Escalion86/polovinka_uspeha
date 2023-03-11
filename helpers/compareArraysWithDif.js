const compareArrays = (arrayOld, arrayNew) => {
  if (
    arrayOld === null ||
    typeof arrayOld !== 'object' ||
    arrayNew === null ||
    typeof arrayNew !== 'object'
  )
    return { same: false }
  let removed = []
  if (arrayOld.length !== 0) {
    removed = arrayOld.filter((data) => !arrayNew.includes(data))
  }
  let added = []
  if (arrayNew.length !== 0) {
    added = arrayNew.filter((data) => !arrayOld.includes(data))
  }
  return { added, removed, same: added.length === 0 && removed.length === 0 }
}

export default compareArrays
