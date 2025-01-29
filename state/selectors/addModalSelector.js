'use client'

import { atom } from 'jotai'

import modalsAtom from '@state/atoms/modalsAtom'

const addModal = (modals, props) => {
  const maxId =
    modals.length > 0
      ? Math.max.apply(
          null,
          modals.map((modal) => modal.id)
        )
      : -1

  if (props.uid && modals.find((modal) => modal.props.uid === props.uid))
    return modals

  const idForNewModal = maxId < 0 ? 0 : maxId + 1

  return [...modals, { id: idForNewModal, props }]
}

const addModalSelector = atom(
  () => get(modalsAtom),
  (get, set, props) => {
    set(modalsAtom, addModal(get(modalsAtom), props))
  }
)

export default addModalSelector
