'use client'

import ContentHeader from '@components/ContentHeader'
import Filter from '@components/Filter'
import AddButton from '@components/IconToggleButtons/AddButton'
import EventParticipantToggleButtons from '@components/IconToggleButtons/EventParticipantToggleButtons'
import EventStatusToggleButtons from '@components/IconToggleButtons/EventStatusToggleButtons'
import FilterToggleButton from '@components/IconToggleButtons/FilterToggleButton'
import SearchToggleButton from '@components/IconToggleButtons/SearchToggleButton'
import Search from '@components/Search'
import SortingButtonMenu from '@components/SortingButtonMenu'
import filterItems from '@helpers/filterItems'
import { getNounEvents } from '@helpers/getNoun'
import isEventActiveFunc from '@helpers/isEventActive'
import isEventCanceledFunc from '@helpers/isEventCanceled'
import isEventClosedFunc from '@helpers/isEventClosed'
import isEventExpiredFunc from '@helpers/isEventExpired'
import sortFuncGenerator from '@helpers/sortFuncGenerator'
import visibleEventsForUser from '@helpers/visibleEventsForUser'
import EventsList from '@layouts/lists/EventsList'
import asyncEventsUsersByUserIdAtom from '@state/async/asyncEventsUsersByUserIdAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'

const defaultFilterValue = {
  directions: null,
  tags: [],
}

const EventsContent = () => {
  const events = useAtomValue(eventsAtom)
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const loggedUserActiveStatusName = useAtomValue(loggedUserActiveStatusAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)

  const seeHidden = loggedUserActiveRole?.events?.seeHidden
  const statusFilterFull = loggedUserActiveRole?.events?.statusFilterFull
  const seeAddButton = loggedUserActiveRole?.events?.add

  const modalsFunc = useAtomValue(modalsFuncAtom)

  const eventsLoggedUser = useAtomValue(
    asyncEventsUsersByUserIdAtom(loggedUserActive?._id)
  )

  const [isSearching, setIsSearching] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [filter, setFilter] = useState({
    status: {
      active: true,
      finished: false,
      closed: false,
      canceled: false,
    },
    participant: {
      participant: true,
      notParticipant: true,
    },
  })
  const [searchText, setSearchText] = useState('')

  const [sort, setSort] = useState({ dateStart: 'asc' })
  const sortFunc = useMemo(() => sortFuncGenerator(sort), [sort])

  const [filterOptions, setFilterOptions] = useState(defaultFilterValue)

  const filteredEvents = useMemo(
    () =>
      visibleEventsForUser(
        events,
        eventsLoggedUser,
        loggedUserActive,
        false,
        seeHidden,
        loggedUserActiveStatusName
      ),
    [
      events,
      eventsLoggedUser,
      loggedUserActive,
      seeHidden,
      loggedUserActiveStatusName,
    ]
  )

  const searchedEvents = useMemo(() => {
    if (!isSearching || !searchText) return filteredEvents
    return filterItems(filteredEvents, searchText, [], {}, ['title'])
  }, [filteredEvents, searchText, isSearching])

  const visibleEvents = useMemo(
    () =>
      searchedEvents.filter((event) => {
        const isEventExpired = isEventExpiredFunc(event)
        const isEventActive = isEventActiveFunc(event)
        const isEventCanceled = isEventCanceledFunc(event)
        const isEventClosed = isEventClosedFunc(event)
        const haveEventTag =
          filterOptions.tags?.length === 0
            ? true
            : event.tags
              ? event.tags.find((tag) => filterOptions.tags.includes(tag))
              : false
        return (
          haveEventTag &&
          ((isEventClosed &&
            (statusFilterFull
              ? filter.status.closed
              : filter.status.finished)) ||
            (isEventActive &&
              (isEventExpired
                ? filter.status.finished
                : filter.status.active)) ||
            (isEventCanceled && filter.status.canceled)) &&
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
      }),
    [searchedEvents, filter, filterOptions]
  )

  const filteredAndSortedEvents = useMemo(
    () => [...visibleEvents].sort(sortFunc),
    [visibleEvents, sort]
  )

  const isFiltered = filterOptions.directions || filterOptions.tags.length > 0

  return (
    <>
      <ContentHeader>
        <EventStatusToggleButtons
          value={filter.status}
          onChange={(value) =>
            setFilter((state) => ({ ...state, status: value }))
          }
        />
        <EventParticipantToggleButtons
          value={filter.participant}
          onChange={(value) =>
            setFilter((state) => ({ ...state, participant: value }))
          }
        />
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounEvents(visibleEvents.length)}
          </div>
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
          {seeAddButton && <AddButton onClick={() => modalsFunc.event.add()} />}
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
      {/* <CardListWrapper> */}
      <EventsList
        events={filteredAndSortedEvents}
        onTagClick={(tag) => {
          setFilterOptions((state) => ({ ...state, tags: [tag] }))
          setShowFilter(true)
        }}
      />
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
