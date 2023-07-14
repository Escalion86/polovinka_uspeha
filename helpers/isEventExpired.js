import { getRecoil } from 'recoil-nexus'
import getDiffBetweenDates from './getDiffBetweenDates'
import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
// import getMinutesBetween from './getMinutesBetween'

const isEventExpired = (event) => {
  const serverDate = new Date(getRecoil(serverSettingsAtom)?.dateTime)
  return getDiffBetweenDates(event?.dateEnd, serverDate) >= 0
}
// getMinutesBetween(event.date) >= (event.duration ?? 0)

export default isEventExpired
