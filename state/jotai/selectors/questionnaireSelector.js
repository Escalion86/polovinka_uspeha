import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_QUESTIONNAIRE } from '@helpers/constants'
import questionnairesAtom from '@state/jotai/atoms/questionnairesAtom'

export const questionnaireSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return DEFAULT_QUESTIONNAIRE
    return get(questionnairesAtom).find((item) => item._id === id)
  })
)

export default questionnaireSelector
