const compareArrays = (arrayOld, arrayNew) => {
  let removed = 0
  if (arrayOld.length !== 0) {
    removed = arrayOld.filter((data) => !arrayNew.includes(data))
  }
  let added = 0
  if (arrayNew.length === 0) {
    added = arrayNew.filter((data) => !arrayOld.includes(data))
  }
  return { added, removed }
}

export default compareArrays
