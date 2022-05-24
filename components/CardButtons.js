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
  faEllipsisV,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip'
import useWindowDimensions, {
  useWindowDimensionsTailwind,
} from '@helpers/useWindowDimensions'

import { motion } from 'framer-motion'
import { useState } from 'react'

const CardButton = ({ active, icon, onClick, color = 'red', dataTip }) => (
  <div
    className={cn(
      `duration-300 flex border items-center justify-center w-8 h-8 hover:bg-${color}-600 border-${color}-500 hover:border-${color}-600 hover:text-white`,
      active ? `bg-${color}-500 text-white` : `bg-white text-${color}-500`
    )}
    onClick={(e) => {
      e.stopPropagation()
      onClick && onClick()
    }}
    data-tip={dataTip}
  >
    <FontAwesomeIcon icon={icon} className="w-6 h-6" />
    <ReactTooltip
      effect="solid"
      delayShow={400}
      // backgroundColor="white"
      // textColor="black"
      // border
      // borderColor="gray"
      type="dark"
    />
  </div>
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
    data-tip={dataTip}
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

  // if (device === 'phoneV' || device === 'phoneH') {

  // }

  // const router = useRouter()

  // const refreshPage = () => {
  //   router.replace(router.asPath)
  // }

  return device === 'phoneV' || device === 'phoneH' ? (
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
        <div className="h-full bg-red-200 border border-gray-200">
          {onUpClick && (
            <MenuItem
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
            <MenuItem
              icon={faArrowDown}
              onClick={() => {
                setOpen(false)
                onDownClick()
              }}
              color="gray"
              dataTip="Переместить ниже"
            />
          )}
          <MenuItem
            icon={faPencilAlt}
            onClick={() => {
              setOpen(false)
              modalsFunc[typeOfItem].edit(item._id)
            }}
            color="orange"
            dataTip="Редактировать"
          />
          {typeOfItem !== 'user' && typeOfItem !== 'review' && (
            <MenuItem
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
            <MenuItem
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
          <MenuItem
            icon={faTrashAlt}
            onClick={() => {
              setOpen(false)
              modalsFunc[typeOfItem].delete(item._id)
            }}
            color="red"
            dataTip="Удалить"
          />
        </div>
      </motion.div>
      <div className="flex items-center justify-center w-8 h-8 text-general">
        <FontAwesomeIcon icon={faEllipsisV} className="w-6 h-6" />
      </div>
    </div>
  ) : (
    <div className="flex">
      {onUpClick && (
        <CardButton
          icon={faArrowUp}
          onClick={onUpClick}
          color="gray"
          dataTip="Переместить выше"
        />
      )}
      {onDownClick && (
        <CardButton
          icon={faArrowDown}
          onClick={onDownClick}
          color="gray"
          dataTip="Переместить ниже"
        />
      )}
      <CardButton
        icon={faPencilAlt}
        onClick={() => modalsFunc[typeOfItem].edit(item._id)}
        color="orange"
        dataTip="Редактировать"
      />
      {typeOfItem !== 'user' && typeOfItem !== 'review' && (
        <CardButton
          icon={faCopy}
          onClick={() => modalsFunc[typeOfItem].add(item._id)}
          color="blue"
          dataTip="Клонировать"
        />
      )}
      {showOnSiteOnClick && (
        <CardButton
          active={!item.showOnSite}
          icon={item.showOnSite ? faEye : faEyeSlash}
          onClick={() => showOnSiteOnClick()}
          color="purple"
          dataTip="Показывать на сайте"
        />
      )}
      <CardButton
        icon={faTrashAlt}
        onClick={() => modalsFunc[typeOfItem].delete(item._id)}
        color="red"
        dataTip="Удалить"
      />
    </div>
  )
}

export default CardButtons
