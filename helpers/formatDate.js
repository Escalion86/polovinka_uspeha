const formatDate = (date, forComponent = false) => {
  if (!date) return undefined
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  if (forComponent) return [year, month, day].join('-')
  else return [day, month, year].join('.')
}

export default formatDate
