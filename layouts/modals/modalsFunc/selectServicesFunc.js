import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

import { DirectionItem, ServiceItem } from '@components/ItemCards'
import filterItems from '@helpers/filterItems'
import Search from '@components/Search'
import ListWrapper from '@layouts/lists/ListWrapper'
import servicesAtom from '@state/atoms/servicesAtom'
import isObject from '@helpers/isObject'

const selectServicesFunc = (
  state,
  filterRules,
  onConfirm,
  exceptedIds,
  maxServices,
  canSelectNone = true,
  title
) => {
  const SelectServicesModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setComponentInFooter,
  }) => {
    const services = useRecoilValue(servicesAtom)
    const [selectedServices, setSelectedServices] = useState(
      isObject(state)
        ? state.filter((item) => typeof item === 'string' && item !== '')
        : []
    )
    const [showErrorMax, setShowErrorMax] = useState(false)

    const [searchText, setSearchText] = useState('')

    var filteredServices = filterItems(services, searchText, exceptedIds, {}, [
      'title',
    ])

    if (exceptedIds) {
      filteredServices = filteredServices.filter(
        (direction) => !exceptedIds.includes(direction._id)
      )
    }

    const onClick = (directionId) => {
      const index = selectedServices.indexOf(directionId)
      // Клик по уже выбранному зрителю?
      if (index >= 0) {
        setShowErrorMax(false)
        setSelectedServices((state) =>
          state.filter((item) => item !== directionId)
        ) //state.splice(index, 1)
      } else {
        if (!maxServices || selectedServices.length < maxServices) {
          setShowErrorMax(false)
          setSelectedServices((state) => [...state, directionId])
        } else {
          if (maxServices === 1) {
            setSelectedServices([directionId])
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
      // maxServices !== 1 &&
      setComponentInFooter(
        <div className="flex text-lg gap-x-1 teblet:text-base flex-nowrap">
          <span>Выбрано:</span>
          <span className="font-bold">{selectedServices.length}</span>
          {maxServices && (
            <>
              <span>/</span>
              <span>{maxServices}</span>
            </>
          )}
          <span>напрвл.</span>
        </div>
      )
      setOnConfirmFunc(() => {
        onConfirm(selectedServices)
        closeModal()
      })
      // setOnShowOnCloseConfirmDialog(isFormChanged)
      // setDisableConfirm(!isFormChanged)
    }, [
      selectedServices,
      maxServices,
      // mansIds,
      // womansIds,
      // assistantsIds,
      // reservedParticipantsIds,
      // bannedParticipantsIds,
    ])

    useEffect(() => {
      if (!canSelectNone) setDisableConfirm(selectedServices.length === 0)
    }, [canSelectNone, selectedServices])

    return (
      <div className="flex flex-col w-full h-full max-h-full gap-y-0.5">
        <Search
          searchText={searchText}
          show={true}
          onChange={setSearchText}
          className="h-[38px] min-h-[38px]"
        />
        <div
          style={{ height: filteredServices.length * 51 + 2 }}
          className={`tablet:flex-none border-gray-700 border-t flex-col tablet:max-h-[calc(100vh-185px)]`}
        >
          <ListWrapper itemCount={filteredServices.length} itemSize={51}>
            {({ index, style }) => (
              <div style={style} className="border-b border-gray-700">
                <ServiceItem
                  key={filteredServices[index]._id}
                  item={filteredServices[index]}
                  active={selectedServices.includes(
                    filteredServices[index]._id
                  )}
                  onClick={() => onClick(filteredServices[index]._id)}
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
          {filteredServices.map((direction) => (
            <DirectionItem
              key={direction._id}
              item={direction}
              active={selectedServices.includes(direction._id)}
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
    title: title ?? (maxServices === 1 ? `Выбор услуги` : `Выбор услуг`),
    confirmButtonName: 'Применить',
    // showConfirm: true,
    Children: SelectServicesModal,
  }
}

export default selectServicesFunc
