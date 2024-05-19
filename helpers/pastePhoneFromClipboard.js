const pastePhoneFromClipboard = async () => {
  var clipboard = parseInt(await navigator.clipboard.readText())

  if (!clipboard) return
  clipboard = String(clipboard)
  // if (clipboard.startsWith('+'))
  //   setPhone(clipboard.substring(1))
  // else
  if (clipboard[0] == '8') return parseInt(`7${clipboard.substring(1)}`)
  if (clipboard[0] == '7') return parseInt(clipboard)
  return parseInt(`7${clipboard}`)
}

export default pastePhoneFromClipboard
