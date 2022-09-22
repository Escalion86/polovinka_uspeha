import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { DirectionItem, UserItem } from '@components/ItemCards'
import directionsAtom from '@state/atoms/directionsAtom'

const selectDirectionFunc = (state, onConfirm, exceptedIds) => {
  const SelectDirectionModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const directions = useRecoilValue(directionsAtom)
    const [selectedDirection, setSelectedDirection] = useState(state ?? [])

    var filteredDirections = filterItems(
      directions,
      searchText,
      exceptedIds,
      null
    )

    const [searchText, setSearchText] = useState('')
    const inputRef = useRef()

    if (exceptedIds) {
      filteredDirections = filteredDirections.filter(
        (direction) => !exceptedIds.includes(direction._id)
      )
    }

    const onClick = (direction) => {
      setSelectedDirection(direction._id)
    }

    useEffect(() => {
      // const isFormChanged =
      //   assistantsIds !== eventAssistantsIds ||
      //   mansIds !== eventMansIds ||
      //   womansIds !== eventWomansIds ||
      //   reservedParticipantsIds !== eventReservedParticipantsIds ||
      //   bannedParticipantsIds !== eventBannedParticipantsIds

      setOnConfirmFunc(() => {
        onConfirm(selectedDirection)
        closeModal()
      })
      // setOnShowOnCloseConfirmDialog(isFormChanged)
      // setDisableConfirm(!isFormChanged)
    }, [
      selectedDirection,
      // mansIds,
      // womansIds,
      // assistantsIds,
      // reservedParticipantsIds,
      // bannedParticipantsIds,
    ])

    return (
      <div>
        {filteredDirections.map((direction) => (
          <DirectionItem
            key={direction._id}
            item={direction}
            active={selectedDirection === direction._id}
            onClick={onClick}
          />
        ))}
      </div>
    )
  }

  return {
    title: `Выбор направления`,
    confirmButtonName: 'Применить',
    // showConfirm: true,
    Children: SelectDirectionModal,
  }
}

export default selectDirectionFunc
