import getDiffBetweenDates from './getDiffBetweenDates'
import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import store from '@state/store'
// import getMinutesBetween from './getMinutesBetween'

const getServerDate = (serverDate) =>
  serverDate ||
  (typeof store?.get === 'function' && store.get(serverSettingsAtom)?.dateTime
    ? new Date(store.get(serverSettingsAtom).dateTime)
    : new Date())

const isEventExpired = (event, serverDate) => {
  if (!event) return
  return getDiffBetweenDates(event?.dateEnd, getServerDate(serverDate)) >= 0
}
// getMinutesBetween(event.date) >= (event.duration ?? 0)

export default isEventExpired
