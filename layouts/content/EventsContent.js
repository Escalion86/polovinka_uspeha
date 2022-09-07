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
        {Object.entries(options).map(([key, { type, value, name, items }]) => {
          const [componentValue, setComponentValue] = useState(value)
          if (type === 'toggle') {
            return (
              <FormControl size="small" className="mt-2" key={key}>
                <ToggleButton
                  size="small"
                  value="check"
                  selected={componentValue}
                  onChange={() => {
                    setComponentValue(!componentValue)
                    onChangeFilter(key, !componentValue)
                  }}
                  color="primary"
                >
                  <Check />
                  <div>{name}</div>
                </ToggleButton>
              </FormControl>
            )
          } else if (type === 'multiselect')
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
                  onChange={(e) => {
                    setComponentValue(e.target.value)
                    onChangeFilter(key, e.target.value)
                  }}
                  input={<OutlinedInput label={name} />}
                  renderValue={(selected) =>
                    selected.length === Object.keys(items).length
                      ? 'Все'
                      : items.length === 1
                      ? items.find((item) => item._id === selected[0]).title
                      : getNounDirections(selected.length)
                  }
                  MenuProps={MenuProps}
                >
                  {[...items].map((item) => (
                    <MenuItem
                      sx={{ padding: 0 }}
                      key={item._id}
                      value={item._id}
                    >
                      <Checkbox
                        checked={componentValue.indexOf(item._id) > -1}
                      />
                      <ListItemText primary={item.title} size="small" />
                      {/* {item.title} */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )
        })}
      </div>
    </motion.div>
  )
}

const EventsContent = () => {
  // const classes = useStyles()

  const events = useRecoilValue(eventsAtom)
  const directions = useRecoilValue(directionsAtom)
  const loggedUser = useRecoilValue(loggedUserAtom)
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const [showFilter, setShowFilter] = useState(false)
  const [showFinished, setShowFinished] = useState(false)
  const [isSorted, setIsSorted] = useState(false)
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
    showedDirections: directionsIds,
  })

  const options = {
    showedDirections: {
      type: 'multiselect',
      value: directionsIds,
      name: 'Направления',
      items: directions,
    },
  }

  const filteredEvents = useMemo(
    () =>
      visibleEventsForUser(events, eventsLoggedUser, loggedUser, true).filter(
        (event) =>
          showFinished !== isEventExpiredFunc(event) &&
          filterOptions.showedDirections.includes(event.directionId)
      ),
    [loggedUser, showFinished, filterOptions.showedDirections.length]
  )

  const filteredAndSortedEvents = useMemo(
    () =>
      [...filteredEvents].sort((a, b) =>
        (isSorted ? a.date < b.date : a.date > b.date) ? -1 : 1
      ),
    [filteredEvents, isSorted]
  )
  console.log('1', 1)

  const isFiltered = filterOptions.showedDirections.length !== directions.length

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2 px-2 py-1 text-black bg-white border-b border-gray-700">
        <ButtonGroup
          className=""
          // variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            onClick={() => setShowFinished(true)}
            variant={showFinished ? 'contained' : 'outlined'}
          >
            Предстоящие
          </Button>
          <Button
            onClick={() => setShowFinished(false)}
            variant={!showFinished ? 'contained' : 'outlined'}
          >
            Завершенные
          </Button>
        </ButtonGroup>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounEvents(filteredEvents.length)}
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
              // noButtons={
              //   loggedUser?.role !== 'admin' && loggedUser?.role !== 'dev'
              // }
            />
          ))
        ) : (
          <div className="flex justify-center p-2">{`Нет мероприятий`}</div>
        )}
        {(loggedUser?.role === 'admin' || loggedUser?.role === 'dev') && (
          <Fab onClick={() => modalsFunc.event.add()} show />
        )}
      </CardListWrapper>
    </>
  )
}

export default EventsContent
