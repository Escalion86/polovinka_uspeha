const fileSizeValidator = (file, maxSize = 100 * 1024 * 1024) => {
  // let file = e.target.files[0]
  if ((file && !file.name) || file.size > maxSize) {
    return false
  }
  return true
}

export default fileSizeValidator
