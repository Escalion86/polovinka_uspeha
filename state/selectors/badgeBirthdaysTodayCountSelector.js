import { atom } from 'jotai'

import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import usersAtomAsync from '@state/async/usersAtomAsync'

const badgeBirthdaysTodayCountSelector = atom(async (get) => {
  const users = await get(usersAtomAsync)
  const dateNow = new Date(get(serverSettingsAtom)?.dateTime)
  const monthNow = dateNow.getMonth()
  const dayNow = dateNow.getDate()
  return users.filter((user) => {
    if (!user.birthday) return false
    const userDate = new Date(user.birthday)
    const userMonth = userDate.getMonth()
    const userDay = userDate.getDate()
    return userDay === dayNow && userMonth === monthNow
  }).length
})

export default badgeBirthdaysTodayCountSelector
