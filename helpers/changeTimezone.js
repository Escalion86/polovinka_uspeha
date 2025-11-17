export default function changeTimezone(date, ianatz) {
  const baseDate = date instanceof Date ? date : new Date(date)

  // suppose the date is 12:00 UTC
  var invdate = new Date(
    baseDate.toLocaleString('en-US', {
      timeZone: ianatz,
    })
  )
  // then invdate will be 07:00 in Toronto
  // and the diff is 5 hours
  var diff = baseDate.getTime() - invdate.getTime()
  // so 12:00 in Toronto is 17:00 UTC
  return new Date(baseDate.getTime() - diff) // needs to substract
}
