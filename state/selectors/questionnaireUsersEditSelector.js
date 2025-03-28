'use client'

import { atom } from 'jotai'

import questionnairesUsersAtom from '@state/atoms/questionnairesUsersAtom'

const questionnaireUsersEditSelector = atom(null, (get, set, newItem) => {
  const items = get(questionnairesUsersAtom)
  if (!newItem?._id) return
  const findedItem = items.find(
    (questionnaireUsers) => questionnaireUsers._id === newItem._id
  )
  // Если мы обновляем существующий атом
  if (findedItem) {
    const newItemsList = items.map((questionnaireUsers) => {
      if (questionnaireUsers._id === newItem._id) return newItem
      return questionnaireUsers
    })
    set(questionnairesUsersAtom, newItemsList)
  } else {
    // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
    set(questionnairesUsersAtom, [...items, newItem])
  }
})

export default questionnaireUsersEditSelector
