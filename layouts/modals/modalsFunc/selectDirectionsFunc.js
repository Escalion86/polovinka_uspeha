import React, { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { DirectionItem, UserItem } from '@components/ItemCards'
import directionsAtom from '@state/atoms/directionsAtom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import filterItems from '@helpers/filterItems'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

const selectDirectionsFunc = (
  state,
  filterRules,
  onConfirm,
  exceptedIds,
  maxDirections,
  canSelectNone = true,
  title
) => {
  const SelectDirectionsModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setComponentInFooter,
  }) => {
    const directions = useRecoilValue(directionsAtom)
    const [selectedDirections, setSelectedDirections] = useState(
      typeof state === 'object'
        ? state.filter((item) => typeof item === 'string' && item !== '')
        : []
    )
    const [showErrorMax, setShowErrorMax] = useState(false)

    const [searchText, setSearchText] = useState('')
    const inputRef = useRef()

    var filteredDirections = filterItems(
      directions,
      searchText,
      exceptedIds,
      null
    )

    if (exceptedIds) {
      filteredDirections = filteredDirections.filter(
        (direction) => !exceptedIds.includes(direction._id)
      )
    }

    const onClick = (directionId) => {
      const index = selectedDirections.indexOf(directionId)
      // Клик по уже выбранному зрителю?
      if (index >= 0) {
        setShowErrorMax(false)
        setSelectedDirections((state) =>
          state.filter((item) => item !== directionId)
        ) //state.splice(index, 1)
      } else {
        if (!maxDirections || selectedDirections.length < maxDirections) {
          setShowErrorMax(false)
          setSelectedDirections((state) => [...state, directionId])
        } else {
          if (maxDirections === 1) {
            setSelectedDirections([directionId])
          } else setShowErrorMax(true)
        }
      }
    }

    useEffect(() => {
      // const isFormChanged =
      //   assistantsIds !== eventAssistantsIds ||
      //   mansIds !== eventMansIds ||
      //   womansIds !== eventWomansIds ||
      //   reservedParticipantsIds !== eventReservedParticipantsIds ||
      //   bannedParticipantsIds !== eventBannedParticipantsIds
      // maxDirections !== 1 &&
      setComponentInFooter(
        <div className="flex text-lg gap-x-1 teblet:text-base flex-nowrap">
          <span>Выбрано:</span>
          <span className="font-bold">{selectedDirections.length}</span>
          {maxDirections && (
            <>
              <span>/</span>
              <span>{maxDirections}</span>
            </>
          )}
          <span>напрвл.</span>
        </div>
      )
      setOnConfirmFunc(() => {
        onConfirm(selectedDirections)
        closeModal()
      })
      // setOnShowOnCloseConfirmDialog(isFormChanged)
      // setDisableConfirm(!isFormChanged)
    }, [
      selectedDirections,
      maxDirections,
      // mansIds,
      // womansIds,
      // assistantsIds,
      // reservedParticipantsIds,
      // bannedParticipantsIds,
    ])

    useEffect(() => inputRef.current.focus(), [inputRef])

    useEffect(() => {
      if (!canSelectNone) setDisableConfirm(selectedDirections.length === 0)
    }, [canSelectNone, selectedDirections])

    return (
      <div className="flex flex-col max-h-full">
        <div
          className={cn(
            'flex gap-1 items-center border-gray-700 border p-1 mb-1 rounded'
            // { hidden: !isMenuOpen }
          )}
        >
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <FontAwesomeIcon
            className={'w-6 h-6 text-gray-700 cursor-pointer'}
            icon={searchText ? faTimes : faSearch}
            onClick={
              searchText
                ? () => setSearchText('')
                : () => inputRef.current.focus()
            }
          />
          {/* {moreOneFilterTurnOnExists ? (
              <div
                className={cn(
                  moreOneFilter ? 'bg-yellow-400' : 'bg-primary',
                  'hover:bg-toxic text-white flex items-center justify-center font-bold rounded cursor-pointer w-7 h-7'
                )}
                onClick={() => setMoreOneFilter(!moreOneFilter)}
              >
                {'>0'}
              </div>
            ) : null} */}
        </div>

        <div className="flex-1 overflow-y-auto max-h-200">
          {filteredDirections.map((direction) => (
            <DirectionItem
              key={direction._id}
              item={direction}
              active={selectedDirections.includes(direction._id)}
              onClick={() => onClick(direction._id)}
            />
          ))}

          {showErrorMax && (
            <div className="text-danger">
              Выбрано максимальное количество направлений
            </div>
          )}
        </div>
      </div>
    )
  }

  return {
    title:
      title ??
      (maxDirections === 1 ? `Выбор направления` : `Выбор направлений`),
    confirmButtonName: 'Применить',
    // showConfirm: true,
    Children: SelectDirectionsModal,
  }
}

export default selectDirectionsFunc
