import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import eventsAtom from '@state/atoms/eventsAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'

import eventsUsersByUserIdSelector from '@state/selectors/eventsUsersByUserIdSelector'
import visibleEventsForUser from '@helpers/visibleEventsForUser'
import { useMemo, useState } from 'react'
import isEventExpiredFunc from '@helpers/isEventExpired'
import directionsAtom from '@state/atoms/directionsAtom'

import { getNounEvents } from '@helpers/getNoun'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import Filter from '@components/Filter'
import ContentHeader from '@components/ContentHeader'
import FilterToggleButton from '@components/IconToggleButtons/FilterToggleButton'
import EventStatusToggleButtons from '@components/IconToggleButtons/EventStatusToggleButtons'
import SortingButtonMenu from '@components/SortingButtonMenu'
import isEventActiveFunc from '@helpers/isEventActive'
import isEventCanceledFunc from '@helpers/isEventCanceled'
import isEventClosedFunc from '@helpers/isEventClosed'
import sortFunctions from '@helpers/sortFunctions'
import AddButton from '@components/IconToggleButtons/AddButton'

import EventsList from '@layouts/lists/EventsList'
import SearchToggleButton from '@components/IconToggleButtons/SearchToggleButton'
import filterItems from '@helpers/filterItems'
import Search from '@components/Search'
import EventParticipantToggleButtons from '@components/IconToggleButtons/EventParticipantToggleButtons'

const EventsContent = () => {
  const events = useRecoilValue(eventsAtom)
  const directions = useRecoilValue(directionsAtom)
  const loggedUser = useRecoilValue(loggedUserAtom)
  const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)
  const loggedUserActiveStatus = useRecoilValue(loggedUserActiveStatusAtom)
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const eventsOfUser = useRecoilValue(
    eventsUsersByUserIdSelector(loggedUser._id)
  )
  // const windowWidthNum = useWindowDimensionsTailwindNum()

  const [isSearching, setIsSearching] = useState(false)
  const [sort, setSort] = useState({ dateStart: 'asc' })
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

  const sortKey = Object.keys(sort)[0]
  const sortValue = sort[sortKey]
  const sortFunc = sortFunctions[sortKey]
    ? sortFunctions[sortKey][sortValue]
    : undefined

  const eventsLoggedUser = useRecoilValue(
    eventsUsersByUserIdSelector(loggedUser?._id)
  )

  const directionsIds = useMemo(
    () => [...directions].map((direction) => direction._id),
    [directions]
  )

  const [filterOptions, setFilterOptions] = useState({
    directions: directionsIds,
  })

  const options = {
    directions: {
      type: 'directions',
      value: directionsIds,
      name: 'Направления',
      items: directions,
    },
  }

  const filteredEvents = useMemo(
    () =>
      visibleEventsForUser(
        events,
        eventsLoggedUser,
        loggedUser,
        false,
        isLoggedUserModer,
        loggedUserActiveStatus
      ),
    [
      events,
      eventsLoggedUser,
      loggedUser,
      isLoggedUserModer,
      loggedUserActiveStatus,
    ]
  )

  const searchedEvents = useMemo(() => {
    if (!searchText) return filteredEvents
    return filterItems(filteredEvents, searchText, [], {}, ['title'])
  }, [filteredEvents, searchText])

  const visibleEvents = useMemo(
    () =>
      searchedEvents.filter((event) => {
        const isEventExpired = isEventExpiredFunc(event)
        const isEventActive = isEventActiveFunc(event)
        const isEventCanceled = isEventCanceledFunc(event)
        const isEventClosed = isEventClosedFunc(event)
        return (
          ((isEventClosed && !isLoggedUserModer && filter.status.finished) ||
            (isEventClosed && isLoggedUserModer && filter.status.closed) ||
            (isEventActive && filter.status.finished && isEventExpired) ||
            (isEventActive && filter.status.active && !isEventExpired) ||
            (isEventCanceled && filter.status.canceled)) &&
          filterOptions.directions.includes(event.directionId) &&
          ((filter.participant?.participant &&
            filter.participant?.notParticipant) ||
          !!eventsOfUser.find((eventUser) => eventUser.eventId === event._id)
            ? filter.participant?.participant
            : filter.participant?.notParticipant)
        )
      }),
    [searchedEvents, filter, filterOptions.directions.length]
  )

  const filteredAndSortedEvents = useMemo(
    () => [...visibleEvents].sort(sortFunc),
    [visibleEvents, sort]
  )

  const isFiltered = filterOptions.directions.length !== directions.length

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

        {/* <ButtonGroup
          className=""
          // variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            onClick={() => setShowFinished(false)}
            variant={!showFinished ? 'contained' : 'outlined'}
          >
            Предстоящие
          </Button>
          <Button
            onClick={() => setShowFinished(true)}
            variant={showFinished ? 'contained' : 'outlined'}
          >
            Завершенные
          </Button>
        </ButtonGroup> */}
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
              if (isSearching) setSearchText('')
            }}
          />
          {isLoggedUserModer && (
            <AddButton onClick={() => modalsFunc.event.add()} />
          )}
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
      <Filter show={showFilter} options={options} onChange={setFilterOptions} />
      {/* <CardListWrapper> */}
      <EventsList events={filteredAndSortedEvents} />
      {/* <div className="flex-1 w-full bg-opacity-15 bg-general">
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
                  //   loggedUser?.role !== 'admin' && loggedUser?.role !== 'dev'
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
              //   loggedUser?.role !== 'admin' && loggedUser?.role !== 'dev'
              // }
            />
          ))
        ) : (
          <div className="flex justify-center p-2">{`Нет мероприятий`}</div>
        )} */}
      {/* {isLoggedUserAdmin && (
          <Fab onClick={() => modalsFunc.event.add()} show />
        )} */}
      {/* </CardListWrapper> */}
    </>
  )
}

export default EventsContent
