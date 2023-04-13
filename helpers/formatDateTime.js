import { DAYS_OF_WEEK, MONTHS, MONTHS_FULL } from './constants'

/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
// Date.prototype.getWeek = function (dowOffset) {
//   /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

//   dowOffset = typeof dowOffset == 'number' ? dowOffset : 0 //default dowOffset to zero
//   var newYear = new Date(this.getFullYear(), 0, 1)
//   var day = newYear.getDay() - dowOffset //the day of week the year begins on
//   day = day >= 0 ? day : day + 7
//   var daynum =
//     Math.floor(
//       (this.getTime() -
//         newYear.getTime() -
//         (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
//         86400000
//     ) + 1
//   var weeknum
//   //if the year starts before the middle of a week
//   if (day < 4) {
//     weeknum = Math.floor((daynum + day - 1) / 7) + 1
//     if (weeknum > 52) {
//       nYear = new Date(this.getFullYear() + 1, 0, 1)
//       nday = nYear.getDay() - dowOffset
//       nday = nday >= 0 ? nday : nday + 7
//       /*if the next year starts before the middle of
//                 the week, it is week #1 of that year*/
//       weeknum = nday < 4 ? 1 : 53
//     }
//   } else {
//     weeknum = Math.floor((daynum + day - 1) / 7)
//   }
//   return weeknum
// }

function formatDateTime(
  dateTime,
  fullMonth = true,
  forComponent = false,
  showDayOfWeek = true,
  twoLines = false,
  durationMinutes,
  showYear = true,
  showTime = true
) {
  if (!dateTime) return undefined

  var d = new Date(dateTime),
    minutes = '' + d.getMinutes(),
    hours = '' + d.getHours(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    week = d.getDay(),
    year = d.getFullYear()

  if (minutes.length < 2) minutes = '0' + minutes
  if (hours.length < 2) hours = '0' + hours

  var finishedTime
  if (durationMinutes) {
    var dFinish = new Date(
      new Date(dateTime).getTime() + durationMinutes * 60000
    )
    var dFinishMinutes = '' + dFinish.getMinutes()
    var dFinishHours = '' + dFinish.getHours()
    if (dFinishMinutes.length < 2) dFinishMinutes = '0' + dFinishMinutes
    if (dFinishHours.length < 2) dFinishHours = '0' + dFinishHours
    finishedTime = '-' + dFinishHours + ':' + dFinishMinutes
  }

  if (forComponent) {
    if (day.length < 2) day = '0' + day
    if (month.length < 2) month = '0' + month
    return [year, month, day].join('-') + 'T' + [hours, minutes].join(':')
  } else
    return (
      day +
      ' ' +
      (fullMonth ? MONTHS_FULL[month - 1] : MONTHS[month - 1]) +
      (showYear ? ' ' + year.toString() : '') + //.substr(2, 2) +
      (twoLines ? `\n` : ' ') +
      (showDayOfWeek ? DAYS_OF_WEEK[week] + ' ' : '') +
      (showTime ? hours + ':' + minutes : '') +
      (finishedTime ?? '')
    )
}

export default formatDateTime
