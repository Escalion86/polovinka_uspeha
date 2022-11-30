import { DEFAULT_QUESTIONNAIRE } from '@helpers/constants'
import questionnairesAtom from '@state/atoms/questionnairesAtom'
import { selectorFamily } from 'recoil'

export const questionnaireSelector = selectorFamily({
  key: 'questionnaireSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_QUESTIONNAIRE
      return get(questionnairesAtom).find((item) => item._id === id)
    },
})

export default questionnaireSelector
