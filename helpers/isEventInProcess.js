import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import getDiffBetweenDates from './getDiffBetweenDates'
// import getMinutesBetween from './getMinutesBetween'
import store from '@state/store'

const getServerDate = (serverDate) =>
  serverDate ||
  (typeof store?.get === 'function' && store.get(serverSettingsAtom)?.dateTime
    ? new Date(store.get(serverSettingsAtom).dateTime)
    : new Date())

const isEventInProcess = (event, serverDate) => {
  if (!event) return
  // const minutesBetween = getMinutesBetween(event.date)
  const actualServerDate = getServerDate(serverDate)
  return (
    getDiffBetweenDates(event.dateStart, actualServerDate) >= 0 &&
    getDiffBetweenDates(event.dateEnd, actualServerDate) <= 0
  )

  // return minutesBetween >= 0 && minutesBetween <= event.duration
}
export default isEventInProcess
