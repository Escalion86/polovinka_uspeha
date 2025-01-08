import { atom } from 'jotai'

import { DEFAULT_QUESTIONNAIRE } from '@helpers/constants'
import questionnairesAtom from '@state/jotai/atoms/questionnairesAtom'

const questionnaireDeleteSelector = atom(
  () => DEFAULT_QUESTIONNAIRE,
  (get, set, itemId) => {
    const items = get(questionnairesAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(questionnairesAtom, newItemsList)
  }
)

export default questionnaireDeleteSelector
