// import isObject from './isObject'

const compareObjects = (a, b, props = {}) => {
  if (!a || !b) return null
  const { oneWay, keysOnly, byIDs } = props

  if (oneWay) {
    const newB = {}
    for (const [key, value] of Object.entries(a)) {
      if (!(key in b)) return false
      newB[key] = b[key]
    }
    return JSON.stringify(a) === JSON.stringify(newB)
  } else {
    if (Object.keys(a).length !== Object.keys(b).length) return false

    if (byIDs) {
      var aIds = a.map(({ _id }) => _id).sort()
      var bIds = b.map(({ _id }) => _id).sort()
      return JSON.stringify(aIds) === JSON.stringify(bIds)
    } else if (keysOnly) {
      var aKeys = Object.keys(a).sort()
      var bKeys = Object.keys(b).sort()
      return JSON.stringify(aKeys) === JSON.stringify(bKeys)
      // for (const [key, value] of Object.entries(a)) {
      //   if (!(key in b)) return false
      // }
      // for (const [key, value] of Object.entries(b)) {
      //   if (!(key in a)) return false
      // }
    } else {
      //   const newB = {}
      //   for (const [key, value] of Object.entries(a)) {
      //     if (!(key in b)) return false
      //     newB[key] = b[key]
      //   }
      //   if (JSON.stringify(a) !== JSON.stringify(newB)) return false

      //   const newA = {}
      //   for (const [key, value] of Object.entries(b)) {
      //     if (!(key in a)) return false
      //     newA[key] = a[key]
      //   }
      //   if (JSON.stringify(b) !== JSON.stringify(newA)) return false
      // }

      // for (const [key, value] of Object.entries(a)) {
      //   if (typeof a[key] !== typeof b[key]) return false
      //   if (isObject(a[key]) && !compareObjects(a[key], b[key])) return false
      //   if (a[key] !== b[key]) return false
      // }

      // for (const [key, value] of Object.entries(b)) {
      //   if (typeof b[key] !== typeof a[key]) return false
      //   if (isObject(b[key]) && !compareObjects(b[key], a[key])) return false
      //   if (b[key] !== a[key]) return false
      // }
      return JSON.stringify(a) === JSON.stringify(b)
    }

    return true
  }
}

export default compareObjects
