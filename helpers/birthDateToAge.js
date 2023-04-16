import formatDate from './formatDate'

function textAge(age) {
  if (age === 0) return 'лет'
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
  return txt
}

const birthDateToAge = (
  birthDate,
  showWord = true,
  showDate = false,
  showAge = true,
  addYears = 0
) => {
  if (!birthDate) return
  const tempBirthDate = new Date(birthDate)
  const now = new Date(),
    age = now.getFullYear() - tempBirthDate.getFullYear()
  const result =
    now.setFullYear(1972) < tempBirthDate.setFullYear(1972) ? age - 1 : age
  const formatedText =
    result + addYears + (showWord ? ' ' + textAge(result + addYears) : 0)
  return showDate
    ? formatDate(birthDate, false, false, showAge) +
        (showAge ? ' (' + formatedText + ')' : '')
    : formatedText
}

export default birthDateToAge
