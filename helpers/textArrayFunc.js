const textArrayFunc = (text, fontSize, maxWidth = 2000) => {
  var chars = 0
  var line = 0
  const textSplit = text.split(' ')

  return textSplit.reduce((acc, word) => {
    const wordLength = word.length
    if (chars + wordLength > maxWidth / fontSize) {
      ++line
      chars = 0
    }
    chars += wordLength
    acc[line] = acc[line] ? acc[line] + ' ' + word : word
    return acc
  }, [])
}

export default textArrayFunc
