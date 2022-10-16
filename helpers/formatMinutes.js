import { getNounDays, getNounHours, getNounMinutes } from './getNoun'

function formatMinutes(time, forComponent = false) {
  if (!time || typeof time !== 'number') return undefined

  const days = Math.floor(time / 1440)
  const hours = Math.floor(time / 60) % 24
  const minutes = time % 60

  if (forComponent)
    return (
      (hours <= 9 ? '0' + hours : hours) +
      ':' +
      (minutes <= 9 ? '0' + minutes : minutes)
    )
  else
    return (
      (days > 0 ? getNounDays(days) : '') +
      (hours > 0 ? (days > 0 ? ' ' : '') + getNounHours(hours) : '') +
      (minutes > 0
        ? (hours > 0 || days > 0 ? ' ' : '') + getNounMinutes(minutes)
        : '')
    )
}

export default formatMinutes
