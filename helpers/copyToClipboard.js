const copyToClipboard = async (text) =>
  await navigator.clipboard.writeText(text)

export default copyToClipboard
