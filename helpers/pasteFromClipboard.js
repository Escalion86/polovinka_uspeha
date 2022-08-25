const pasteFromClipboard = (onChange) =>
  navigator.clipboard.readText().then(onChange)

export default pasteFromClipboard
