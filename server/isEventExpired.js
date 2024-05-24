import getDiffBetweenDates from '@helpers/getDiffBetweenDates'

const isEventExpired = (event) => {
  return getDiffBetweenDates(event?.dateEnd) >= 0
}

export default isEventExpired
