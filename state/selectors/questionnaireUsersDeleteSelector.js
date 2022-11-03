import questionnairesUsersAtom from '@state/atoms/questionnairesUsersAtom'
import { selector } from 'recoil'

const questionnaireUsersDeleteSelector = selector({
  key: 'questionnaireUsersDeleteSelector',
  get: () => {
    return null
  },
  set: ({ set, get }, itemId) => {
    const items = get(questionnairesUsersAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(questionnairesUsersAtom, newItemsList)
  },
})

export default questionnaireUsersDeleteSelector
