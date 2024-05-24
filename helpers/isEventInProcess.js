import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import getDiffBetweenDates from './getDiffBetweenDates'
import getMinutesBetween from './getMinutesBetween'
import { getRecoil } from 'recoil-nexus'

const isEventInProcess = (event) => {
  if (!event) return
  // const minutesBetween = getMinutesBetween(event.date)
  const serverDate = new Date(getRecoil(serverSettingsAtom)?.dateTime)
  return (
    getDiffBetweenDates(event.dateStart, serverDate) >= 0 &&
    getDiffBetweenDates(event.dateEnd, serverDate) <= 0
  )

  // return minutesBetween >= 0 && minutesBetween <= event.duration
}
export default isEventInProcess
