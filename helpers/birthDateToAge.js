function textAge(age) {
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
  return txt
}

const birthDateToAge = (birthDate, showWord = true) => {
  birthDate = new Date(birthDate)
  const now = new Date(),
    age = now.getFullYear() - birthDate.getFullYear()
  const result =
    now.setFullYear(1972) < birthDate.setFullYear(1972) ? age - 1 : age
  if (showWord) return result + ' ' + textAge(result)
  else return result
}
export default birthDateToAge
