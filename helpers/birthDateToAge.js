import formatDate from './formatDate'
import textAge from './textAge'

const birthDateToAge = (
  birthDate,
  dateNow,
  showWord = true,
  showDate = false,
  showAge = true,
  addYears = 0
) => {
  if (!birthDate) return
  const tempBirthDate = new Date(birthDate)
  const tempDateNow = dateNow ? new Date(dateNow) : new Date()
  const age = tempDateNow.getFullYear() - tempBirthDate.getFullYear()
  const result =
    tempDateNow.setFullYear(1972) < tempBirthDate.setFullYear(1972)
      ? age - 1
      : age
  const formatedText =
    result + addYears + (showWord ? ' ' + textAge(result + addYears) : 0)
  return showDate
    ? formatDate(birthDate, false, false, showAge) +
        (showAge ? ' (' + formatedText + ')' : '')
    : formatedText
}

export default birthDateToAge
