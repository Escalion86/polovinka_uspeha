import compareObjects from './compareObjects'

const compareObjectsWithDif = (oldObj, newObj) => {
  const dif = {}
  for (const [key, value] of Object.entries(newObj)) {
    if (key !== 'updatedAt' && key !== '_id')
      if (!(key in oldObj)) dif[key] = { old: undefined, new: value }
      else if (oldObj[key] !== null && typeof oldObj[key] === 'object') {
        if (!compareObjects(oldObj[key], newObj[key])) {
          dif[key] = { old: oldObj[key], new: newObj[key] }
        }
      } else if (oldObj[key] !== newObj[key]) {
        dif[key] = { old: oldObj[key], new: newObj[key] }
      }
  }
  return dif
}

export default compareObjectsWithDif
