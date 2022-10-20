import React, { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { EventItem } from '@components/ItemCards'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import eventsAtom from '@state/atoms/eventsAtom'
import filterItems from '@helpers/filterItems'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

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
    const inputRef = useRef()

    var filteredEvents = filterItems(events, searchText, exceptedIds, null)

    if (exceptedIds) {
      filteredEvents = filteredEvents.filter(
        (event) => !exceptedIds.includes(event._id)
      )
    }

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

    useEffect(() => inputRef.current.focus(), [inputRef])

    useEffect(() => {
      if (!canSelectNone) setDisableConfirm(selectedEvents.length === 0)
    }, [canSelectNone, selectedEvents])

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
          {filteredEvents.map((event) => (
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
