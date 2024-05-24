import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import getDiffBetweenDates from './getDiffBetweenDates'
import { getRecoil } from 'recoil-nexus'

const isEventStartedOrExpired = (event) => {
  if (!event) return
  const serverDate = new Date(getRecoil(serverSettingsAtom)?.dateTime)
  return getDiffBetweenDates(event.dateStart, serverDate) >= 0
}
export default isEventStartedOrExpired
