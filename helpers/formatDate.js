import { DAYS_OF_WEEK } from './constants'

const formatDate = (
  date,
  forComponent = false,
  showWeek = false,
  showYaer = true
) => {
  if (!date) return undefined
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear(),
    week = d.getDay()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  if (forComponent) return [year, month, day].join('-')
  else if (showYaer)
    return (
      [day, month, year].join('.') + (showWeek ? ' ' + DAYS_OF_WEEK[week] : '')
    )
  else
    return [day, month].join('.') + (showWeek ? ' ' + DAYS_OF_WEEK[week] : '')
}

export default formatDate
