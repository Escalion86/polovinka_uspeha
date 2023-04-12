import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import directionsAtom from '@state/atoms/directionsAtom'

import { DirectionItem } from '@components/ItemCards'
import filterItems from '@helpers/filterItems'
import Search from '@components/Search'
import ListWrapper from '@layouts/lists/ListWrapper'
import isObject from '@helpers/isObject'

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
      isObject(state)
        ? state.filter((item) => typeof item === 'string' && item !== '')
        : []
    )
    const [showErrorMax, setShowErrorMax] = useState(false)

    const [searchText, setSearchText] = useState('')

    var filteredDirections = filterItems(
      directions,
      searchText,
      exceptedIds,
      {},
      ['title']
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

    useEffect(() => {
      if (!canSelectNone) setDisableConfirm(selectedDirections.length === 0)
    }, [canSelectNone, selectedDirections])

    return (
      <div className="flex flex-col w-full h-full max-h-full gap-y-0.5">
        <Search
          searchText={searchText}
          show={true}
          onChange={setSearchText}
          className="h-[38px] min-h-[38px]"
        />
        <div
          style={{ height: filteredDirections.length * 51 + 2 }}
          className={`tablet:flex-none border-gray-700 border-t flex-col tablet:max-h-[calc(100vh-185px)]`}
        >
          <ListWrapper itemCount={filteredDirections.length} itemSize={51}>
            {({ index, style }) => (
              <div style={style} className="border-b border-gray-700">
                <DirectionItem
                  key={filteredDirections[index]._id}
                  item={filteredDirections[index]}
                  active={selectedDirections.includes(
                    filteredDirections[index]._id
                  )}
                  onClick={() => onClick(filteredDirections[index]._id)}
                />
              </div>
            )}
          </ListWrapper>
        </div>
        {showErrorMax && (
          <div className="text-danger">
            Выбрано максимальное количество направлений
          </div>
        )}

        {/* <div className="flex-1 overflow-y-auto max-h-200">
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
        </div> */}
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
