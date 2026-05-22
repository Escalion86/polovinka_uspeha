import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import getDiffBetweenDates from './getDiffBetweenDates'
import store from '@state/store'

const getServerDate = (serverDate) =>
  serverDate ||
  (typeof store?.get === 'function' && store.get(serverSettingsAtom)?.dateTime
    ? new Date(store.get(serverSettingsAtom).dateTime)
    : new Date())

const isEventStartedOrExpired = (event, serverDate) => {
  if (!event) return
  return getDiffBetweenDates(event.dateStart, getServerDate(serverDate)) >= 0
}
export default isEventStartedOrExpired
