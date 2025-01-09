import getDiffBetweenDates from './getDiffBetweenDates'
import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import store from '@state/store'
// import getMinutesBetween from './getMinutesBetween'

const isEventExpired = (event) => {
  const serverDate = new Date(store.get(serverSettingsAtom)?.dateTime)
  return getDiffBetweenDates(event?.dateEnd, serverDate) >= 0
}
// getMinutesBetween(event.date) >= (event.duration ?? 0)

export default isEventExpired
