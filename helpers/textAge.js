function textAge(age, showNumber = false) {
  if (age === 0) return (showNumber ? `${age} ` : '') + 'лет'
  if (!age) return
  var txt,
    count = age % 100
  if (count >= 5 && count <= 20) {
    txt = 'лет'
  } else {
    count = count % 10
    if (count === 1) {
      txt = 'год'
    } else if (count >= 2 && count <= 4) {
      txt = 'года'
    } else {
      txt = 'лет'
    }
  }
  return (showNumber ? `${age} ` : '') + txt
}

export default textAge
