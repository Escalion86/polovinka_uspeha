import { atom } from 'jotai'

import questionnairesUsersAtom from '@state/atoms/questionnairesUsersAtom'

const questionnaireUsersDeleteSelector = atom(null, (get, set, itemId) => {
  const items = get(questionnairesUsersAtom)
  const newItemsList = items.filter((item) => item._id !== itemId)
  set(questionnairesUsersAtom, newItemsList)
})

export default questionnaireUsersDeleteSelector
