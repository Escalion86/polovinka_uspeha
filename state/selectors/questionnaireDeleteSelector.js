import { DEFAULT_QUESTIONNAIRE } from '@helpers/constants'
import questionnairesAtom from '@state/atoms/questionnairesAtom'
import { selector } from 'recoil'

const questionnaireDeleteSelector = selector({
  key: 'questionnaireDeleteSelector',
  get: () => DEFAULT_QUESTIONNAIRE,
  set: ({ set, get }, itemId) => {
    const items = get(questionnairesAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(questionnairesAtom, newItemsList)
  },
})

export default questionnaireDeleteSelector
