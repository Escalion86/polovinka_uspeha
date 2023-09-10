function calcLuminance(hex) {
  if (!hex) return
  var c = hex.substring(1)
  var rgb = parseInt(c, 16) // convert rrggbb to decimal
  var r = (rgb >> 16) & 0xff // extract red
  var g = (rgb >> 8) & 0xff // extract green
  var b = (rgb >> 0) & 0xff

  return (r * 0.299 + g * 0.587 + b * 0.114) / 256
}

export const textColorClassCalc = (hex) =>
  calcLuminance(hex) < 0.5 ? 'text-white' : 'text-black'

export default calcLuminance
