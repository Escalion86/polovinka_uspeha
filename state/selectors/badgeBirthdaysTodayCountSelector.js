import getDaysBetween from '@helpers/getDaysBetween'
import usersAtom from '@state/atoms/usersAtom'
import { selector } from 'recoil'

export const badgeBirthdaysTodayCountSelector = selector({
  key: 'badgeBirthdaysTodayCountSelector',
  get: ({ get }) => {
    const users = get(usersAtom)
    const dateNow = new Date()
    const monthNow = dateNow.getMonth()
    const dayNow = dateNow.getDate()
    return users.filter((user) => {
      if (!user.birthday) return false
      const userDate = new Date(user.birthday)
      const userMonth = userDate.getMonth()
      const userDay = userDate.getDate()
      return userDay === dayNow && userMonth === monthNow
    }).length
  },
})

export default badgeBirthdaysTodayCountSelector
