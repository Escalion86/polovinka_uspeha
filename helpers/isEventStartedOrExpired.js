import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import getDiffBetweenDates from './getDiffBetweenDates'
import store from '@state/store'

const isEventStartedOrExpired = (event) => {
  if (!event) return
  const serverDate = new Date(store.get(serverSettingsAtom)?.dateTime)
  return getDiffBetweenDates(event.dateStart, serverDate) >= 0
}
export default isEventStartedOrExpired
