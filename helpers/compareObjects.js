const compareObjects = (a, b, oneWay = false) => {
  if (oneWay) {
    const newB = {}
    for (const [key, value] of Object.entries(a)) {
      if (!(key in b)) return false
      newB[key] = b[key]
    }
    return JSON.stringify(a) === JSON.stringify(newB)
  } else return JSON.stringify(a) === JSON.stringify(b)
}

export default compareObjects
