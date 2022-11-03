import { DEFAULT_QUESTIONNAIRE } from '@helpers/constants'
import questionnairesAtom from '@state/atoms/questionnairesAtom'
import { selector } from 'recoil'

const questionnaireEditSelector = selector({
  key: 'questionnaireEditSelector',
  get: () => DEFAULT_QUESTIONNAIRE,
  set: ({ set, get }, newItem) => {
    const items = get(questionnairesAtom)
    if (!newItem?._id) return
    const findedItem = items.find(
      (questionnaire) => questionnaire._id === newItem._id
    )
    // Если мы обновляем существующий атом
    if (findedItem) {
      const newItemsList = items.map((questionnaire) => {
        if (questionnaire._id === newItem._id) return newItem
        return questionnaire
      })
      set(questionnairesAtom, newItemsList)
    } else {
      // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
      set(questionnairesAtom, [...items, newItem])
    }
  },
})

export default questionnaireEditSelector
