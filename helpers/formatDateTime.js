const months = [
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
]

const monthsFull = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

function formatDateTime(dateTime, fullMonth = true, forComponent = false) {
  if (!dateTime) return undefined
  var d = new Date(dateTime),
    minutes = '' + d.getMinutes(),
    hours = '' + d.getHours(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (minutes.length < 2) minutes = '0' + minutes

  if (forComponent) {
    if (day.length < 2) day = '0' + day
    if (hours.length < 2) hours = '0' + hours
    if (month.length < 2) month = '0' + month
    return [year, month, day].join('-') + 'T' + [hours, minutes].join(':')
  } else
    return (
      day +
      ' ' +
      (fullMonth ? monthsFull[month - 1] : months[month - 1]) +
      ' ' +
      year.toString() + //.substr(2, 2) +
      ' ' +
      hours +
      ':' +
      minutes
    )
}

export default formatDateTime
