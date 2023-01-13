import React, { useState } from 'react'
import { motion } from 'framer-motion'
import cn from 'classnames'
// import ValueItem from './ValuePicker/ValueItem'
import {
  faSort,
  faSortAlphaAsc,
  faSortAlphaDesc,
  faSortNumericAsc,
  faSortNumericDesc,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IconToggleButton from './IconToggleButtons/IconToggleButton'
const variants = {
  show: {
    scale: 1,
    // width: 'auto',
    // height: 'auto',
    // top: 0,
    // right: 0,
    translateX: 0,
    translateY: 0,
  },
  hide: {
    scale: 0,
    // top: 0,
    // right: 0,
    // width: 0,
    // height: 0,
    translateX: '50%',
    translateY: '-50%',
  },
}

// const SortItem = ({
//   title,
//   iconAsc = faSort,
//   iconDesc = faSort,
//   onChange,
//   value = null, // null / DESC / ASC
// }) => {
//   return (
//     <div className="p-1">
//       <div className="relative h-8 cursor-pointer group">
//         <div
//           onClick={() => onChange('desc')}
//           className="absolute top-0 bottom-0 left-0 z-50 w-26 group-scope hover:z-40"
//         >
//           <div
//             className={cn(
//               'flex items-center w-10 h-full px-2 rounded-l-lg group-scope-hover:bg-primary group-scope-hover:text-white',
//               value === 'desc' ? 'text-white bg-toxic' : 'text-primary'
//             )}
//           >
//             <FontAwesomeIcon className="w-5 h-5" icon={iconAsc} />
//           </div>
//         </div>
//         <div
//           className={cn(
//             'absolute top-0 bottom-0 z-10 flex items-center justify-center rounded-lg left-8 right-8 group-hover:bg-primary group-hover:text-white',
//             { 'text-white bg-toxic': value }
//           )}
//         >
//           {title}
//         </div>
//         <div
//           onClick={() => onChange('asc')}
//           className="absolute top-0 bottom-0 right-0 z-50 flex justify-end w-26 group-scope hover:z-40"
//         >
//           <div
//             className={cn(
//               'flex items-center justify-end w-10 h-full px-2 rounded-r-lg group-scope-hover:bg-primary group-scope-hover:text-white',
//               value === 'asc' ? 'text-white bg-toxic' : 'text-primary'
//             )}
//           >
//             <FontAwesomeIcon className="w-5 h-5" icon={iconDesc} />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

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
  { key: 'createdAt', title: 'по дате регистрации', type: 'number' },
  { key: 'payAt', title: 'по дате события', type: 'number' },
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
  // const [sort, setSort] = useState({ name: 'asc' })

  const sortKey = Object.keys(sort)[0]
  const sortValue = sort[sortKey]
  const sortParam = sortParams.find((sortP) => sortP.key === sortKey)

  const handleMouseOver = () => {
    if (turnOnHandleMouseOver) {
      // setMenuOpen(false)
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
        {/* <Avatar user={loggedUser} className="z-10" /> */}
        <motion.div
          className={cn(
            'z-0 absolute bg-white flex flex-col top-10 right-0 overflow-hidden duration-300 border border-gray-300 rounded'
            // isUserMenuOpened
            //   ? 'scale-100 h-auto translate-y-0 translate-x-0 w-auto'
            //   : 'w-0 h-0 scale-0 translate-x-[40%] -translate-y-1/2'
          )}
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
          {/* <SortItem
            title="по имени"
            iconAsc={faSortAlphaAsc}
            iconDesc={faSortAlphaDesc}
            value={sort.name}
            onChange={(name) => setSort({ name })}
          />
          <SortItem
            title="по дате"
            iconAsc={faSortAlphaAsc}
            iconDesc={faSortAlphaDesc}
            value={sort.date}
            onChange={(date) => setSort({ date })}
          /> */}
          {/* <div className="relative flex items-center h-8 bg-white">
            <div className="relative flex items-center justify-center w-8 h-8 cursor-pointer group">
              <FontAwesomeIcon icon={faSortAlphaAsc} className="z-10 h-5" />
              <div className="absolute top-0 bottom-0 z-0 w-0 h-8 duration-300 bg-blue-300 rounded-l -right-1 group-hover:w-1/2" />
            </div>
            <div className="z-10 flex items-center justify-center flex-1 h-8 px-1 text-black bg-blue-300 rounded whitespace-nowrap">
              {'по имени'}
            </div>
            <div className="relative flex items-center justify-center w-8 h-8 cursor-pointer group">
              <FontAwesomeIcon icon={faSortAlphaDesc} className="z-10 h-5" />
              <div className="absolute top-0 bottom-0 z-0 w-0 h-8 duration-300 bg-blue-300 rounded-r -left-1 group-hover:w-1/2" />
            </div>
          </div> */}
        </motion.div>
        <IconToggleButton value="sort">
          {/* <div className="w-20">{sortParam.title}</div> */}
          <FontAwesomeIcon
            icon={sortIcons[sortParam.type][sortValue]}
            className="h-6"
          />
        </IconToggleButton>
        {/* <button
          className={cn(
            `h-10 z-10 flex duration-300 outline-none items-center justify-center border px-2 py-1 rounded cursor-pointer gap-x-2 flex-nowrap border-general`,
            // `group-hover:text-white group-hover:bg-general text-general bg-white`,
            turnOnHandleMouseOver
              ? 'text-white bg-general'
              : 'text-general bg-white'
          )}
          // onClick={() => onClick && onClick()}
        >
          <div
            className={cn(
              'w-24 min-w-24 whitespace-nowrap duration-300 select-none',
              // 'group-hover:text-white text-input'
              turnOnHandleMouseOver ? 'text-white' : 'text-input'
            )}
          >
            {sortParam.title}
          </div>
          <FontAwesomeIcon
            icon={sortIcons[sortParam.type][sortValue]}
            className="h-5"
          />
        </button> */}
      </div>
    </div>
  )
}

export default SortingButtonMenu
