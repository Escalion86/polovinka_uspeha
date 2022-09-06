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
import { useState } from 'react'
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
} from '@mui/material'
import { Check, FilterAlt } from '@mui/icons-material'

import { makeStyles } from '@mui/styles'
import getNoun from '@helpers/getNoun'
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

const useStyles = makeStyles({
  customInputLabel: {
    '& legend': {
      visibility: 'visible',
    },
  },
})

const EventsContent = () => {
  const classes = useStyles()

  const events = useRecoilValue(eventsAtom)
  const directions = useRecoilValue(directionsAtom)
  const loggedUser = useRecoilValue(loggedUserAtom)
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const [showFilter, setShowFilter] = useState(false)
  const [showFinished, setShowFinished] = useState(true)
  const [showedDirections, setShowedDirections] = useState(
    [...directions].map((direction) => direction._id)
  )

  const eventsLoggedUser = useRecoilValue(
    eventsUsersByUserIdSelector(loggedUser?._id)
  )

  const filteredEvents = visibleEventsForUser(
    events,
    eventsLoggedUser,
    loggedUser,
    true
  ).filter(
    (event) =>
      (showFinished || !isEventExpiredFunc(event)) &&
      showedDirections.includes(event.directionId)
  )

  const isFiltered =
    showedDirections.length !== directions.length || !showFinished

  return (
    <>
      <div className="flex flex-wrap items-center justify-end px-2 text-black bg-white border-b border-gray-700 gap-x-2">
        <div className="text-lg font-bold">
          {getNoun(
            filteredEvents.length,
            'мероприятие',
            'мероприятия',
            'мероприятий'
          )}
        </div>
        <FormControl size="small" className="my-1">
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
      </div>
      <motion.div
        // initial={{}}
        animate={{ height: showFilter ? 'auto' : 0 }}
        transition={{ type: 'just' }}
        className="flex flex-wrap justify-end overflow-hidden bg-gray-100"
      >
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
        <FormControl size="small" className="mt-2">
          <ToggleButton
            size="small"
            value="check"
            selected={showFinished}
            onChange={() => {
              setShowFinished((state) => !state)
            }}
            color="primary"
          >
            <Check />
            <div>Завершенные</div>
          </ToggleButton>
        </FormControl>
        <FormControl sx={{ m: 1, width: 300 }} size="small" margin="none">
          <InputLabel id="demo-multiple-name-label">Направления</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={showedDirections}
            onChange={(e) => setShowedDirections(e.target.value)}
            input={<OutlinedInput label="Направления" />}
            renderValue={(selected) =>
              selected.length === directions.length
                ? 'Все'
                : selected.length === 1
                ? directions.find((direction) => direction._id === selected[0])
                    .title
                : getNoun(
                    selected.length,
                    'направление',
                    'напрпавления',
                    'направлений'
                  )
            }
            MenuProps={MenuProps}
          >
            {/* <MenuList dense> */}
            {[...directions].map((direction) => (
              <MenuItem
                sx={{ padding: 0 }}
                key={direction._id}
                value={direction._id}
              >
                <Checkbox
                  checked={showedDirections.indexOf(direction._id) > -1}
                />
                <ListItemText primary={direction.title} size="small" />
                {/* {direction.title} */}
              </MenuItem>
            ))}
            {/* </MenuList> */}
          </Select>
        </FormControl>
      </motion.div>
      <CardListWrapper>
        {filteredEvents?.length > 0 ? (
          [...filteredEvents]
            .sort((a, b) => (a.date < b.date ? -1 : 1))
            .map((event) => (
              <EventCard
                key={event._id}
                eventId={event._id}
                // noButtons={
                //   loggedUser?.role !== 'admin' && loggedUser?.role !== 'dev'
                // }
              />
            ))
        ) : (
          <div className="flex justify-center p-2">Нет мероприятий</div>
        )}
        {(loggedUser?.role === 'admin' || loggedUser?.role === 'dev') && (
          <Fab onClick={() => modalsFunc.event.add()} show />
        )}
      </CardListWrapper>
    </>
  )
}

export default EventsContent
