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

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

// const useStyles = makeStyles({
//   customInputLabel: {
//     '& legend': {
//       visibility: 'visible',
//     },
//   },
// })

const Filter = ({ options, show, onChange }) => {
  const onChangeFilter = (key, newValue) => {
    onChange((state) => {
      return { ...state, [key]: newValue }
    })
  }

  const elements = Object.entries(options).map(
    ([key, { type, value, name, items }]) => {
      const [componentValue, setComponentValue] = useState(value)
      const onChangeComponent = (key, newValue) => {
        setComponentValue(newValue)
        onChangeFilter(key, newValue)
      }

      if (type === 'toggle') {
        return (
          <FormControl size="small" className="mt-2" key={key}>
            <ToggleButton
              size="small"
              value="check"
              selected={componentValue}
              onChange={() => onChangeComponent(key, !componentValue)}
              color="primary"
            >
              <Check />
              <div>{name}</div>
            </ToggleButton>
          </FormControl>
        )
      } else if (type === 'directions') {
        const directions = useRecoilValue(directionsAtom)
        return (
          <FormControl
            sx={{ m: 1, width: 300 }}
            size="small"
            margin="none"
            key={key}
          >
            <InputLabel id="demo-multiple-name-label">Направления</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={componentValue}
              onChange={(e) => onChangeComponent(key, e.target.value)}
              input={<OutlinedInput label="Направления" />}
              renderValue={(selected) =>
                selected.length === directions.length
                  ? 'Все'
                  : selected.length === 1
                  ? directions.find(
                      (direction) => direction._id === selected[0]
                    ).title
                  : getNounDirections(selected.length)
              }
              MenuProps={MenuProps}
            >
              {directions.map((direction) => (
                <MenuItem
                  sx={{ padding: 0 }}
                  key={direction._id}
                  value={direction._id}
                >
                  <Checkbox
                    checked={componentValue.indexOf(direction._id) > -1}
                  />
                  <ListItemText primary={direction.title} size="small" />
                  {/* {item.title} */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      } else if (type === 'multiselect') {
        return (
          <FormControl
            sx={{ m: 1, width: 300 }}
            size="small"
            margin="none"
            key={key}
          >
            <InputLabel id="demo-multiple-name-label">{name}</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={componentValue}
              onChange={(e) => onChangeComponent(key, e.target.value)}
              input={<OutlinedInput label={name} />}
              renderValue={(selected) =>
                selected.length === items.length ? 'Все' : selected.join(', ')
              }
              MenuProps={MenuProps}
            >
              {[...items].map((item) => (
                <MenuItem sx={{ padding: 0 }} key={item._id} value={item._id}>
                  <Checkbox checked={componentValue.indexOf(item._id) > -1} />
                  <ListItemText primary={item.title} size="small" />
                  {/* {item.title} */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      }
    }
  )

  return (
    <motion.div
      // initial={{}}
      animate={{ height: show ? 'auto' : 0 }}
      transition={{ type: 'just' }}
      className="flex flex-wrap justify-end overflow-hidden bg-gray-100"
    >
      <div>
        {/* <button
    className={cn(
      'hover:shadow-active duration-300  flex items-center justify-center h-10 px-2 py-1 text-black border border-gray-400 rounded',
      showFinished ? 'bg-green-200' : 'bg-white'
    )}
    onMouseDown={(evt) => {
      evt.preventDefault() // Avoids loosing focus from the editable area
      setShowFinished((state) => !state)
    }}
  >
    <Image src="/img/svg_icons/medal.svg" width="24" height="24" />
    Показывать завершенные
    <FontAwesomeIcon icon={icon} className={iconClassName ?? 'w-5 h-5'} />
  </button> */}
        {elements}
      </div>
    </motion.div>
  )
}

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
    [loggedUser, isLoggedUserAdmin, loggedUserActiveStatus]
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
      <div className="flex flex-wrap items-center justify-center gap-2 px-2 py-1 text-black bg-white border-b border-gray-700">
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
            <ToggleButton
              size="small"
              value="filter"
              selected={isFiltered}
              onChange={() => {
                setShowFilter((state) => !state)
              }}
              color="warning"
            >
              <FilterAlt />
            </ToggleButton>
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
      </div>
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
