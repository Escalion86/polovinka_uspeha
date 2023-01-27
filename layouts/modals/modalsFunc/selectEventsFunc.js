import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import eventsAtom from '@state/atoms/eventsAtom'

import { EventItem } from '@components/ItemCards'
import filterItems from '@helpers/filterItems'
import sortFunctions from '@helpers/sortFunctions'
import Search from '@components/Search'

const selectEventsFunc = (
  state,
  filterRules,
  onConfirm,
  exceptedIds,
  maxEvents,
  canSelectNone = true,
  title
) => {
  const SelectEventsModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setComponentInFooter,
  }) => {
    const events = useRecoilValue(eventsAtom)
    const [selectedEvents, setSelectedEvents] = useState(
      typeof state === 'object'
        ? state.filter((item) => typeof item === 'string' && item !== '')
        : []
    )
    const [showErrorMax, setShowErrorMax] = useState(false)

    const [searchText, setSearchText] = useState('')

    var filteredEvents = filterItems(events, searchText, exceptedIds, {}, [
      'title',
    ])

    if (exceptedIds) {
      filteredEvents = filteredEvents.filter(
        (event) => !exceptedIds.includes(event._id)
      )
    }

    const sortedEvents = [...filteredEvents].sort(sortFunctions.dateStart.asc)

    const onClick = (eventId) => {
      const index = selectedEvents.indexOf(eventId)
      // Клик по уже выбранному зрителю?
      if (index >= 0) {
        setShowErrorMax(false)
        setSelectedEvents((state) => state.filter((item) => item !== eventId)) //state.splice(index, 1)
      } else {
        if (!maxEvents || selectedEvents.length < maxEvents) {
          setShowErrorMax(false)
          setSelectedEvents((state) => [...state, eventId])
        } else {
          if (maxEvents === 1) {
            setSelectedEvents([eventId])
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
      // maxEvents !== 1 &&
      setComponentInFooter(
        <div className="flex text-lg gap-x-1 teblet:text-base flex-nowrap">
          <span>Выбрано:</span>
          <span className="font-bold">{selectedEvents.length}</span>
          {maxEvents && (
            <>
              <span>/</span>
              <span>{maxEvents}</span>
            </>
          )}
          <span>меропр.</span>
        </div>
      )
      setOnConfirmFunc(() => {
        onConfirm(selectedEvents)
        closeModal()
      })
      // setOnShowOnCloseConfirmDialog(isFormChanged)
      // setDisableConfirm(!isFormChanged)
    }, [
      selectedEvents,
      maxEvents,
      // mansIds,
      // womansIds,
      // assistantsIds,
      // reservedParticipantsIds,
      // bannedParticipantsIds,
    ])

    useEffect(() => {
      if (!canSelectNone) setDisableConfirm(selectedEvents.length === 0)
    }, [canSelectNone, selectedEvents])

    return (
      <div className="flex flex-col w-full h-full max-h-full gap-y-0.5">
        <Search searchText={searchText} show={true} onChange={setSearchText} />

        <div className="flex-1 overflow-y-auto max-h-200">
          {sortedEvents.map((event) => (
            <EventItem
              key={event._id}
              item={event}
              active={selectedEvents.includes(event._id)}
              onClick={() => onClick(event._id)}
            />
          ))}

          {showErrorMax && (
            <div className="text-danger">
              Выбрано максимальное количество мероприятий
            </div>
          )}
        </div>
      </div>
    )
  }

  return {
    title:
      title ?? (maxEvents === 1 ? `Выбор мероприятия` : `Выбор мероприятий`),
    confirmButtonName: 'Применить',
    // showConfirm: true,
    Children: SelectEventsModal,
  }
}

export default selectEventsFunc
