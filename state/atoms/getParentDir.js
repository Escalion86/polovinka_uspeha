const getParentDir = (path) => {
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')
  if (trimmedPath.indexOf('/') === -1) return trimmedPath
  return trimmedPath.substring(0, trimmedPath.indexOf('/'))
}

export default getParentDir
