'use client'

import ContentHeader from '@components/ContentHeader'
import CityManagementBlockedBanner from '@components/CityManagementBlockedBanner'
import Filter from '@components/Filter'
import AddButton from '@components/IconToggleButtons/AddButton'
import EventParticipantToggleButtons from '@components/IconToggleButtons/EventParticipantToggleButtons'
import EventStatusToggleButtons from '@components/IconToggleButtons/EventStatusToggleButtons'
import FilterToggleButton from '@components/IconToggleButtons/FilterToggleButton'
import SearchToggleButton from '@components/IconToggleButtons/SearchToggleButton'
import Search from '@components/Search'
import SortingButtonMenu from '@components/SortingButtonMenu'
import EventsCalendarView from './EventsCalendarView'
import filterItems from '@helpers/filterItems'
import { getNounEvents } from '@helpers/getNoun'
import isEventActiveFunc from '@helpers/isEventActive'
import isEventCanceledFunc from '@helpers/isEventCanceled'
import isEventClosedFunc from '@helpers/isEventClosed'
import isEventExpiredFunc from '@helpers/isEventExpired'
import sortFuncGenerator from '@helpers/sortFuncGenerator'
import visibleEventsForUser from '@helpers/visibleEventsForUser'
import useCityManagementAccess from '@hooks/useCityManagementAccess'
import EventsList from '@layouts/lists/EventsList'
import cn from 'classnames'
import asyncEventsUsersByUserIdAtom from '@state/async/asyncEventsUsersByUserIdAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import locationAtom from '@state/atoms/locationAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'

const defaultFilterValue = {
  directions: null,
}

const EventsContent = ({ mode = 'all', calendarOnly = false }) => {
  const events = useAtomValue(eventsAtom)
  const location = useAtomValue(locationAtom)
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const loggedUserActiveStatusName = useAtomValue(loggedUserActiveStatusAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)

  const seeHidden = loggedUserActiveRole?.events?.seeHidden
  const statusFilterFull = loggedUserActiveRole?.events?.statusFilterFull
  const seeAddButton = loggedUserActiveRole?.events?.add
  const {
    loading: cityAccessLoading,
    allowEventManagement,
    cityTitle,
  } = useCityManagementAccess()

  const isClient = loggedUserActiveRole?._id === 'client'

  const modalsFunc = useAtomValue(modalsFuncAtom)

  const eventsLoggedUser = useAtomValue(
    asyncEventsUsersByUserIdAtom(loggedUserActive?._id)
  )

  const statusDefault = useMemo(() => {
    if (calendarOnly)
      return {
        active: true,
        finished: true,
        closed: true,
        canceled: false,
      }
    if (mode === 'past')
      return {
        active: false,
        finished: true,
        closed: true,
        canceled: false,
      }
    if (mode === 'upcoming')
      return {
        active: true,
        finished: false,
        closed: false,
        canceled: false,
      }
    return {
      active: true,
      finished: false,
      closed: false,
      canceled: false,
    }
  }, [calendarOnly, mode])

  const statusButtons = useMemo(() => {
    if (isClient) return []
    if (mode === 'upcoming') return ['canceled']
    if (mode === 'past') return ['finished', 'closed', 'canceled']
    return ['active', 'finished', 'closed', 'canceled']
  }, [isClient, mode])

  const statusLabels = useMemo(() => {
    if (mode === 'upcoming')
      return {
        canceled: 'Показывать отмененные',
      }
    return undefined
  }, [mode])

  const [isSearching, setIsSearching] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [viewMode, setViewMode] = useState(calendarOnly ? 'calendar' : 'list')
  const [filter, setFilter] = useState({
    status: statusDefault,
    participant: {
      participant: true,
      notParticipant: true,
    },
  })
  const [searchText, setSearchText] = useState('')

  const [sort, setSort] = useState({
    dateStart: mode === 'past' ? 'desc' : 'asc',
  })
  const sortFunc = useMemo(() => sortFuncGenerator(sort), [sort])

  const [filterOptions, setFilterOptions] = useState(defaultFilterValue)
  const [monthEventsCount, setMonthEventsCount] = useState(0)
  const todayLabel = useMemo(() => {
    const now = new Date()
    return `Сегодня ${now.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    })}`
  }, [])

  useEffect(() => {
    if (calendarOnly) {
      setViewMode('calendar')
    }
  }, [calendarOnly])

  useEffect(() => {
    setFilter((state) => {
      const nextStatus = statusDefault
      if (
        state.status.active === nextStatus.active &&
        state.status.finished === nextStatus.finished &&
        state.status.closed === nextStatus.closed &&
        state.status.canceled === nextStatus.canceled
      ) {
        return state
      }
      return {
        ...state,
        status: nextStatus,
      }
    })
    setSort((state) => {
      const desired = mode === 'past' ? 'desc' : 'asc'
      if (state.dateStart === desired) return state
      return { dateStart: desired }
    })
  }, [mode, statusDefault])

  const getVisibleEventsForSource = useCallback(
    (sourceEvents = []) =>
      visibleEventsForUser(
        sourceEvents,
        eventsLoggedUser,
        loggedUserActive,
        false,
        seeHidden,
        loggedUserActiveStatusName
      ),
    [eventsLoggedUser, loggedUserActive, seeHidden, loggedUserActiveStatusName]
  )

  const applyFiltersAndSort = useCallback(
    (sourceEvents = []) => {
      const filteredEvents = getVisibleEventsForSource(sourceEvents)
      const searchedEvents =
        isSearching && searchText
          ? filterItems(filteredEvents, searchText, [], {}, ['title'])
          : filteredEvents

      const visibleEvents = searchedEvents.filter((event) => {
        const isEventExpired = isEventExpiredFunc(event)
        const isEventActive = isEventActiveFunc(event)
        const isEventCanceled = isEventCanceledFunc(event)
        const isEventClosed = isEventClosedFunc(event)
        const isCanceledByMode =
          isEventCanceled &&
          filter.status.canceled &&
          (mode === 'upcoming'
            ? !isEventExpired
            : mode === 'past'
              ? isEventExpired
              : true)

        return (
          ((isEventClosed &&
            (statusFilterFull
              ? filter.status.closed
              : filter.status.finished)) ||
            (isEventActive &&
              (isEventExpired
                ? filter.status.finished
                : filter.status.active)) ||
            isCanceledByMode) &&
          (!filterOptions.directions ||
            filterOptions.directions === event.directionId) &&
          ((filter.participant?.participant &&
            filter.participant?.notParticipant) ||
          !!eventsLoggedUser.find(
            (eventUser) => eventUser.eventId === event._id
          )
            ? filter.participant?.participant
            : filter.participant?.notParticipant)
        )
      })

      return [...visibleEvents].sort(sortFunc)
    },
    [
      eventsLoggedUser,
      filter,
      filterOptions,
      getVisibleEventsForSource,
      isSearching,
      mode,
      searchText,
      sortFunc,
      statusFilterFull,
    ]
  )

  const filteredAndSortedEvents = useMemo(
    () => applyFiltersAndSort(events),
    [applyFiltersAndSort, events]
  )
  const visibleEvents = filteredAndSortedEvents

  const isFiltered = Boolean(filterOptions.directions)

  return (
    <>
      {!cityAccessLoading && !allowEventManagement ? (
        <CityManagementBlockedBanner cityTitle={cityTitle} />
      ) : null}
      <ContentHeader>
        <div className="flex items-center justify-center w-full gap-x-2">
          {statusButtons.length > 0 && (
            <EventStatusToggleButtons
              value={filter.status}
              onChange={(value) =>
                setFilter((state) => ({ ...state, status: value }))
              }
              availableButtons={statusButtons}
              labels={statusLabels}
            />
          )}
          <EventParticipantToggleButtons
            value={filter.participant}
            onChange={(value) =>
              setFilter((state) => ({ ...state, participant: value }))
            }
          />
        </div>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          {calendarOnly ? (
            <div className="mr-auto text-sm tablet:text-base font-semibold text-[#6b1f2a]">
              {todayLabel}
            </div>
          ) : null}
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounEvents(
              calendarOnly ? monthEventsCount : visibleEvents.length
            )}
          </div>
          {!calendarOnly ? (
            <>
              <SortingButtonMenu
                sort={sort}
                onChange={setSort}
                sortKeys={['dateStart']}
              />
              <FilterToggleButton
                value={isFiltered}
                onChange={() => {
                  setShowFilter((state) => !state)
                }}
              />
              <SearchToggleButton
                value={isSearching}
                onChange={() => {
                  setIsSearching((state) => !state)
                  // if (isSearching) setSearchText('')
                }}
              />
            </>
          ) : null}
          {seeAddButton && allowEventManagement ? (
            <AddButton onClick={() => modalsFunc.event.add()} />
          ) : null}
          {/* <FormControl size="small">
            <ToggleButton
              size="small"
              value="sort"
              selected={isSorted}
              onChange={() => {
                setIsSorted((state) => !state)
              }}
              color="warning"
            >
              <Sort />
            </ToggleButton>
          </FormControl> */}
        </div>
      </ContentHeader>
      {!calendarOnly ? (
        <>
          <Search
            searchText={searchText}
            show={isSearching}
            onChange={setSearchText}
            className="mx-1 bg-gray-100"
          />
          <Filter
            show={showFilter}
            onChange={setFilterOptions}
            filterOptions={filterOptions}
            defaultFilterValue={defaultFilterValue}
            setShowFilter={setShowFilter}
          />
        </>
      ) : null}
      {/* <CardListWrapper> */}
      {viewMode === 'calendar' ? (
        <div className="w-full h-full overflow-y-scroll">
          <EventsCalendarView
            events={filteredAndSortedEvents}
            location={location}
            applyFiltersAndSort={applyFiltersAndSort}
            onMonthEventsCountChange={setMonthEventsCount}
            onOpenEvent={(eventId) => modalsFunc.event.view(eventId)}
          />
        </div>
      ) : (
        <EventsList
          events={filteredAndSortedEvents}
          persistScrollKey={mode === 'past' ? 'events-past' : undefined}
        />
      )}
      {/* <div className="flex-1 w-full bg-general/15">
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              itemCount={filteredAndSortedEvents.length}
              itemSize={
                windowWidthNum > 3 ? 182 : windowWidthNum === 3 ? 151 : 194
              }
              width={width}
            >
              {({ index, style }) => (
                <EventCard
                  style={style}
                  key={filteredAndSortedEvents[index]._id}
                  eventId={filteredAndSortedEvents[index]._id}
                  // hidden={!visibleEventsIds.includes(event._id)}
                  // noButtons={
                  //   loggedUserActive?.role !== 'admin' && loggedUserActive?.role !== 'dev'
                  // }
                />
              )}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div> */}
      {/* {filteredAndSortedEvents?.length > 0 ? (
          filteredAndSortedEvents.map((event) => (
            <EventCard
              key={event._id}
              eventId={event._id}
              // hidden={!visibleEventsIds.includes(event._id)}
              // noButtons={
              //   loggedUserActive?.role !== 'admin' && loggedUserActive?.role !== 'dev'
              // }
            />
          ))
        ) : (
          <div className="flex justify-center p-2">{`Нет мероприятий`}</div>
        )} */}
      {/* </CardListWrapper> */}
    </>
  )
}

export default EventsContent
