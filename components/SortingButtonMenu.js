import {
  faSortAlphaAsc,
  faSortAlphaDesc,
  faSortNumericAsc,
  faSortNumericDesc,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import { motion } from 'framer-motion'
import { useState } from 'react'
import IconToggleButton from './IconToggleButtons/IconToggleButton'

const variants = {
  show: {
    scale: 1,
    translateX: 0,
    translateY: 0,
  },
  hide: {
    scale: 0,
    translateX: '50%',
    translateY: '-50%',
  },
}

const sortIcons = {
  number: {
    asc: faSortNumericAsc,
    desc: faSortNumericDesc,
  },
  string: {
    asc: faSortAlphaAsc,
    desc: faSortAlphaDesc,
  },
}

const sortParams = [
  {
    key: 'name',
    title: 'по имени',
    type: 'string',
  },
  { key: 'dateStart', title: 'по дате', type: 'number' },
  { key: 'birthday', title: 'по возрасту', type: 'number' },
  { key: 'createdAt', title: 'по дате создания', type: 'number' },
  { key: 'payAt', title: 'по дате события', type: 'number' },
  {
    key: 'eventsUserCount',
    title: 'по кол-ву посещ. мероприятий',
    type: 'number',
  },
]

const SortItem = ({ title, iconAsc, iconDesc, value, onChange }) => {
  return (
    <div className="relative flex items-center h-8 m-0.5 group-one">
      <div
        onClick={() => onChange('asc')}
        className="absolute left-0 z-10 flex items-center justify-end w-1/2 h-8 cursor-pointer group"
      >
        <div
          className={cn(
            'flex items-center justify-end mr-[calc(100%-2.5rem)] h-8 overflow-hidden rounded-l',
            value === 'asc'
              ? 'w-10 bg-success'
              : 'duration-300 w-2 group-hover:w-10 group-one-hover:bg-general'
          )}
        >
          <FontAwesomeIcon
            icon={iconAsc}
            className="w-6 h-6 mr-3 text-white min-w-6"
          />
          {value && (
            <div className="z-20 h-8 absolute right-[calc(100%-2.55rem)] w-2 rounded-l min-w-2 bg-success" />
          )}
        </div>
      </div>
      <FontAwesomeIcon icon={iconAsc} className="w-6 h-6 ml-1 text-general" />
      <div
        className={cn(
          'mx-3 px-1 flex items-center justify-center flex-1 h-8 group whitespace-nowrap',
          value
            ? 'bg-success text-white'
            : 'duration-300 text-black group-one-hover:bg-general group-one-hover:text-white'
        )}
      >
        {title}
      </div>
      <FontAwesomeIcon icon={iconDesc} className="w-6 h-6 mr-1 text-general" />
      <div
        onClick={() => onChange('desc')}
        className="absolute right-0 z-10 flex items-center justify-start w-1/2 h-8 cursor-pointer group"
      >
        <div
          className={cn(
            'flex items-center justify-start ml-[calc(100%-2.5rem)] h-8 overflow-hidden rounded-r',
            value === 'desc'
              ? 'w-10 bg-success'
              : 'duration-300 w-2 group-hover:w-10 group-one-hover:bg-general'
          )}
        >
          {value && (
            <div className="bg-successz-20 h-8 absolute left-[calc(100%-2.55rem)] w-2 rounded-r min-w-2 bg-success" />
          )}
          <FontAwesomeIcon
            icon={iconDesc}
            className="z-10 w-6 h-6 ml-3 text-white min-w-6"
          />
        </div>
      </div>
    </div>
  )
}

const SortingButtonMenu = ({ sort, onChange, sortKeys = [] }) => {
  const [isUserMenuOpened, setIsUserMenuOpened] = useState(false)
  const [turnOnHandleMouseOver, setTurnOnHandleMouseOver] = useState(true)

  const sortKey = Object.keys(sort)[0]
  const sortValue = sort[sortKey]
  const sortParam = sortParams.find((sortP) => sortP.key === sortKey)

  const handleMouseOver = () => {
    if (turnOnHandleMouseOver) {
      setIsUserMenuOpened(true)
    }
  }

  const handleMouseOut = () => setIsUserMenuOpened(false)

  return (
    <div
      className="flex items-start justify-end h-10"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={() => {
        setTurnOnHandleMouseOver(false)
        setIsUserMenuOpened(!isUserMenuOpened)
        const timer = setTimeout(() => {
          setTurnOnHandleMouseOver(true)
          clearTimeout(timer)
        }, 500)
      }}
    >
      <div className="relative">
        <motion.div
          className="absolute right-0 z-0 flex flex-col overflow-hidden duration-300 bg-white border border-gray-300 rounded top-10"
          variants={variants}
          animate={isUserMenuOpened ? 'show' : 'hide'}
          initial="hide"
          transition={{ duration: 0.2, type: 'tween' }}
        >
          {sortParams
            .filter((sortParam) => sortKeys.includes(sortParam.key))
            .map((sortParam) => (
              <SortItem
                key={'sort' + sortParam.key}
                title={sortParam.title}
                iconAsc={sortIcons[sortParam.type].asc}
                iconDesc={sortIcons[sortParam.type].desc}
                value={sort[sortParam.key]}
                onChange={(value) => onChange({ [sortParam.key]: value })}
              />
            ))}
        </motion.div>
        <IconToggleButton value="sort">
          <FontAwesomeIcon
            icon={sortIcons[sortParam.type][sortValue]}
            className="h-6"
          />
        </IconToggleButton>
      </div>
    </div>
  )
}

export default SortingButtonMenu
