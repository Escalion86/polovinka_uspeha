import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import {
  faCopy,
  faEye,
  faEyeSlash,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons'
import cn from 'classnames'
import {
  faArrowDown,
  faArrowUp,
  faBan,
  faEllipsisV,
  faPencilAlt,
  faPlay,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { useWindowDimensionsTailwind } from '@helpers/useWindowDimensions'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Tooltip from './Tooltip'

const CardButton = ({ active, icon, onClick, color = 'red', dataTip }) => (
  <Tooltip content={dataTip}>
    <div
      className={cn(
        `duration-300 flex border items-center justify-center w-8 h-8 hover:bg-${color}-600 border-${color}-500 hover:border-${color}-600 hover:text-white`,
        active ? `bg-${color}-500 text-white` : `bg-white text-${color}-500`
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick()
      }}
    >
      <FontAwesomeIcon icon={icon} className="w-6 h-6" />
    </div>
  </Tooltip>
)

const MenuItem = ({ active, icon, onClick, color = 'red', dataTip }) => (
  <div
    className={cn(
      `px-2 duration-300 flex items-center gap-x-2 h-8 hover:bg-${color}-600 hover:text-white`,
      active ? `bg-${color}-500 text-white` : `bg-white text-${color}-500`
    )}
    onClick={(e) => {
      e.stopPropagation()
      onClick && onClick()
    }}
  >
    <FontAwesomeIcon icon={icon} className="w-6 h-6" />
    <div className="whitespace-nowrap">{dataTip}</div>
  </div>
)

const CardButtons = ({
  item,
  typeOfItem,
  showOnSiteOnClick,
  onUpClick,
  onDownClick,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const device = useWindowDimensionsTailwind()

  const [open, setOpen] = useState(false)

  const isCompact = device === 'phoneV' || device === 'phoneH'

  const ItemComponent = isCompact ? MenuItem : CardButton

  // const items = [
  //   {condition: typeOfItem === 'event',
  //   icon: faUsers,
  //   onClick: () => {
  //     setOpen(false)
  //     modalsFunc.event.users(item._id)
  //   },
  //   color:"green",
  //   dataTip:"Участники мероприятия"
  // }
  // ]

  const items = (
    <>
      {typeOfItem === 'event' && (
        <ItemComponent
          icon={faUsers}
          onClick={() => {
            setOpen(false)
            // onUpClick()
            modalsFunc.event.users(item._id)
          }}
          color="green"
          dataTip="Участники мероприятия"
        />
      )}
      {onUpClick && (
        <ItemComponent
          icon={faArrowUp}
          onClick={() => {
            setOpen(false)
            onUpClick()
          }}
          color="gray"
          dataTip="Переместить выше"
        />
      )}
      {onDownClick && (
        <ItemComponent
          icon={faArrowDown}
          onClick={() => {
            setOpen(false)
            onDownClick()
          }}
          color="gray"
          dataTip="Переместить ниже"
        />
      )}
      <ItemComponent
        icon={faPencilAlt}
        onClick={() => {
          setOpen(false)
          modalsFunc[typeOfItem].edit(item._id)
        }}
        color="orange"
        dataTip="Редактировать"
      />
      {typeOfItem !== 'user' && typeOfItem !== 'review' && (
        <ItemComponent
          icon={faCopy}
          onClick={() => {
            setOpen(false)
            modalsFunc[typeOfItem].add(item._id)
          }}
          color="blue"
          dataTip="Клонировать"
        />
      )}
      {showOnSiteOnClick && (
        <ItemComponent
          active={!item.showOnSite}
          icon={item.showOnSite ? faEye : faEyeSlash}
          onClick={() => {
            setOpen(false)
            showOnSiteOnClick()
          }}
          color="purple"
          dataTip="Показывать на сайте"
        />
      )}
      {typeOfItem === 'event' && (
        <ItemComponent
          icon={item.status === 'canceled' ? faPlay : faBan}
          onClick={() => {
            setOpen(false)
            if (item.status === 'canceled')
              modalsFunc[typeOfItem].uncancel(item._id)
            else modalsFunc[typeOfItem].cancel(item._id)
          }}
          color={item.status === 'canceled' ? 'green' : 'red'}
          dataTip={item.status === 'canceled' ? 'Возобновить' : 'Отменить'}
        />
      )}
      <ItemComponent
        icon={faTrashAlt}
        onClick={() => {
          setOpen(false)
          modalsFunc[typeOfItem].delete(item._id)
        }}
        color="red"
        dataTip="Удалить"
      />
    </>
  )

  // if (device === 'phoneV' || device === 'phoneH') {

  // }

  // const router = useRouter()

  // const refreshPage = () => {
  //   router.replace(router.asPath)
  // }

  return isCompact ? (
    <div
      className="relative"
      onClick={(e) => {
        e.stopPropagation()
        setOpen((state) => !state)
      }}
    >
      <motion.div
        className="absolute right-0 z-50 overflow-hidden w-min top-8"
        initial={{ height: 0 }}
        animate={{ height: open ? 'auto' : 0 }}
        transition={{ type: 'tween' }}
      >
        <div className="h-full bg-red-200 border border-gray-200">{items}</div>
      </motion.div>
      <div className="flex items-center justify-center w-8 h-8 text-general">
        <FontAwesomeIcon icon={faEllipsisV} className="w-6 h-6" />
      </div>
    </div>
  ) : (
    <div className="flex">{items}</div>
  )
}

export default CardButtons
