const isObjectId = (value) =>
  value && typeof value === 'object' && value.constructor?.name === 'ObjectId'

const serializeLeanDoc = (doc) => {
  if (doc == null) return doc
  if (isObjectId(doc)) return doc.toString()
  if (doc instanceof Date) return doc.toISOString()
  if (Array.isArray(doc)) return doc.map(serializeLeanDoc)
  if (typeof doc === 'object') {
    return Object.entries(doc).reduce((acc, [key, value]) => {
      acc[key] = serializeLeanDoc(value)
      return acc
    }, {})
  }

  return doc
}

export default serializeLeanDoc
