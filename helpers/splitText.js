export default function splitText(text, splitStr = '\n', maxLength = 4096) {
  if (maxLength >= text.length) return [text]
  const splitedText = text.split(splitStr)

  const chunks = ['']
  let j = 0
  for (let i = 0; i < splitedText.length; i++) {
    if (`${chunks[j]}${splitedText[i]}`.length > maxLength) {
      ++j
      chunks[j] = ''
    }
    chunks[j] = `${chunks[j] ? `${chunks[j]}\n` : ''}${splitedText[i]}`
  }

  // const chunks = []
  // let i = 0
  // while (i < text.length) {
  //   chunks.push(text.slice(i, Math.min(i + 4096, text.length)))
  //   i += 4096
  // }
  return chunks
}
