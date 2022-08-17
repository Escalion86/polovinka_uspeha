import getNoun from './getNoun'

function formatMinutes(time, forComponent = false) {
  if (!time || typeof time !== 'number') return undefined

  const hours = Math.floor(time / 60)
  const minutes = time % 60

  if (forComponent)
    return (
      (hours <= 9 ? '0' + hours : hours) +
      ':' +
      (minutes <= 9 ? '0' + minutes : minutes)
    )
  else
    return (
      (hours > 0 ? getNoun(hours, 'час', 'часа', 'часов') : '') +
      (minutes > 0
        ? (hours > 0 ? ' ' : '') + getNoun(minutes, 'минута', 'минуты', 'минут')
        : '')
    )
}

export default formatMinutes
