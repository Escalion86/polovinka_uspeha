import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import Fab from '@components/Fab'
import eventsAtom from '@state/atoms/eventsAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import EventCard from '@layouts/cards/EventCard'
import eventsUsersByUserIdSelector from '@state/selectors/eventsUsersByUserIdSelector'
import visibleEventsForUser from '@helpers/visibleEventsForUser'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import cn from 'classnames'
import isEventExpiredFunc from '@helpers/isEventExpired'
import directionsAtom from '@state/atoms/directionsAtom'
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  MenuList,
  OutlinedInput,
  Select,
  ToggleButton,
  Button,
  ButtonGroup,
} from '@mui/material'
import { Check, FilterAlt, Sort } from '@mui/icons-material'

// import { makeStyles } from '@mui/styles'
import { getNounDirections, getNounEvents } from '@helpers/getNoun'
import { motion } from 'framer-motion'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import Filter from '@components/Filter'
import ContentHeader from '@components/ContentHeader'
import FilterToggleButton from '@components/IconToggleButtons/FilterToggleButton'

const EventsContent = () => {
  // const classes = useStyles()

  const events = useRecoilValue(eventsAtom)
  const directions = useRecoilValue(directionsAtom)
  const loggedUser = useRecoilValue(loggedUserAtom)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
  const loggedUserActiveStatus = useRecoilValue(loggedUserActiveStatusAtom)
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const [showFilter, setShowFilter] = useState(false)
  const [showFinished, setShowFinished] = useState(false)
  const [isSorted, setIsSorted] = useState(true)
  // const [showedDirections, setShowedDirections] = useState(
  //   [...directions].map((direction) => direction._id)
  // )

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
        .filter(
          (event) =>
            showFinished === isEventExpiredFunc(event) &&
            filterOptions.directions.includes(event.directionId)
        )
        .map((event) => event._id),
    [showFinished, filterOptions.directions.length]
  )

  const filteredAndSortedEvents = useMemo(
    () =>
      [...filteredEvents].sort((a, b) =>
        (isSorted ? a.date < b.date : a.date > b.date) ? -1 : 1
      ),
    [filteredEvents, isSorted]
  )

  const isFiltered = filterOptions.directions.length !== directions.length

  return (
    <>
      <ContentHeader>
        <ButtonGroup
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
        </ButtonGroup>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounEvents(visibleEventsIds.length)}
          </div>
          <FormControl size="small">
            <FilterToggleButton
              value={isFiltered}
              onChange={() => {
                setShowFilter((state) => !state)
              }}
            />
            {/* <ToggleButton
              size="small"
              value="filter"
              selected={isFiltered}
              onChange={() => {
                setShowFilter((state) => !state)
              }}
              color="warning"
            >
              <FilterAlt />
            </ToggleButton> */}
          </FormControl>
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
        {isLoggedUserAdmin && (
          <Fab onClick={() => modalsFunc.event.add()} show />
        )}
      </CardListWrapper>
    </>
  )
}

export default EventsContent
