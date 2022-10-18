import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
// import Fab from '@components/Fab'
import eventsAtom from '@state/atoms/eventsAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import EventCard from '@layouts/cards/EventCard'
import eventsUsersByUserIdSelector from '@state/selectors/eventsUsersByUserIdSelector'
import visibleEventsForUser from '@helpers/visibleEventsForUser'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
// import Image from 'next/image'
import { useMemo, useState } from 'react'
import isEventExpiredFunc from '@helpers/isEventExpired'
import directionsAtom from '@state/atoms/directionsAtom'

import { getNounEvents } from '@helpers/getNoun'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import Filter from '@components/Filter'
import ContentHeader from '@components/ContentHeader'
import FilterToggleButton from '@components/IconToggleButtons/FilterToggleButton'
import EventStatusToggleButtons from '@components/IconToggleButtons/EventStatusToggleButtons'
import SortingButtonMenu from '@components/SortingButtonMenu'
import isEventActiveFunc from '@helpers/isEventActive'
import isEventCanceledFunc from '@helpers/isEventCanceled'
import sortFunctions from '@helpers/sortFunctions'
import AddButton from '@components/IconToggleButtons/AddButton'

const EventsContent = () => {
  // const classes = useStyles()

  const events = useRecoilValue(eventsAtom)
  const directions = useRecoilValue(directionsAtom)
  const loggedUser = useRecoilValue(loggedUserAtom)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
  const loggedUserActiveStatus = useRecoilValue(loggedUserActiveStatusAtom)
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const [sort, setSort] = useState({ dateStart: 'asc' })
  const [showFilter, setShowFilter] = useState(false)
  const [filter, setFilter] = useState({
    status: {
      active: true,
      finished: false,
      canceled: false,
    },
  })
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
        isLoggedUserAdmin,
        loggedUserActiveStatus
      ),
    [
      events,
      eventsLoggedUser,
      loggedUser,
      isLoggedUserAdmin,
      loggedUserActiveStatus,
    ]
  )

  const visibleEventsIds = useMemo(
    () =>
      filteredEvents
        .filter((event) => {
          const isEventExpired = isEventExpiredFunc(event)
          const isEventActive = isEventActiveFunc(event)
          const isEventCanceled = isEventCanceledFunc(event)
          return (
            ((isEventActive && filter.status.finished && isEventExpired) ||
              (isEventActive && filter.status.active && !isEventExpired) ||
              (isEventCanceled && filter.status.canceled)) &&
            filterOptions.directions.includes(event.directionId)
          )
        })
        .map((event) => event._id),
    [filteredEvents, filter, filterOptions.directions.length]
  )

  const filteredAndSortedEvents = useMemo(
    () => [...filteredEvents].sort(sortFunc),
    [filteredEvents, sort]
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
            {getNounEvents(visibleEventsIds.length)}
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
          {isLoggedUserAdmin && (
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
      <Filter show={showFilter} options={options} onChange={setFilterOptions} />
      <CardListWrapper>
        {filteredAndSortedEvents?.length > 0 ? (
          filteredAndSortedEvents.map((event) => (
            <EventCard
              key={event._id}
              eventId={event._id}
              hidden={!visibleEventsIds.includes(event._id)}
              // noButtons={
              //   loggedUser?.role !== 'admin' && loggedUser?.role !== 'dev'
              // }
            />
          ))
        ) : (
          <div className="flex justify-center p-2">{`Нет мероприятий`}</div>
        )}
        {/* {isLoggedUserAdmin && (
          <Fab onClick={() => modalsFunc.event.add()} show />
        )} */}
      </CardListWrapper>
    </>
  )
}

export default EventsContent
