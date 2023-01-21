import DevSwitch from '@components/DevSwitch'
import {
  faHome,
  // faList,
  faListAlt,
  // faListSquares,
  // faListUl,
  // faSign,
  faSignInAlt,
  faSignOutAlt,
  faUserAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Avatar from './Avatar'
import { motion } from 'framer-motion'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useState } from 'react'
import menuOpenAtom from '@state/atoms/menuOpen'
import cn from 'classnames'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import getParentDir from '@state/atoms/getParentDir'

const variants = {
  show: {
    scale: 1,
    // width: 'auto',
    // height: 'auto',
    top: 0,
    right: 0,
    translateX: 0,
    translateY: 0,
  },
  hide: {
    scale: 0,
    top: 7,
    right: 7,
    // width: 0,
    // height: 0,
    translateX: '50%',
    translateY: '-50%',
  },
}

const MenuItem = ({ onClick, icon, title, href }) => {
  const Component = (
    <div
      onClick={onClick}
      className="flex items-center px-3 py-2 duration-300 bg-white border border-gray-300 cursor-pointer group gap-x-2 hover:bg-gray-500"
    >
      <FontAwesomeIcon
        icon={icon}
        className="w-5 h-5 text-general group-hover:text-white"
      />
      <span className="text-black prevent-select-text whitespace-nowrap group-hover:text-white">
        {title}
      </span>
    </div>
  )

  if (href)
    return (
      <Link href={href} shallow>
        <a>{Component}</a>
      </Link>
    )
  else return Component
}

const UserMenu = () => {
  const loggedUser = useRecoilValue(loggedUserAtom)
  const setMenuOpen = useSetRecoilState(menuOpenAtom)
  const [isUserMenuOpened, setIsUserMenuOpened] = useState(false)
  const [turnOnHandleMouseOver, setTurnOnHandleMouseOver] = useState(true)

  const router = useRouter()

  const handleMouseOver = () => {
    if (turnOnHandleMouseOver) {
      setMenuOpen(false)
      setIsUserMenuOpened(true)
    }
  }

  const handleMouseOut = () => setIsUserMenuOpened(false)

  return loggedUser ? (
    <div
      className="z-50 flex items-start justify-end h-16"
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
      <div className="relative flex flex-col items-end mt-2.5 w-12">
        <Avatar user={loggedUser} className="z-10" />
        {router && (
          <motion.div
            className={cn(
              'absolute overflow-hidden duration-300 border border-gray-800 rounded-tr-3xl'
              // isUserMenuOpened
              //   ? 'scale-100 h-auto translate-y-0 translate-x-0 w-auto'
              //   : 'w-0 h-0 scale-0 translate-x-[40%] -translate-y-1/2'
            )}
            variants={variants}
            animate={isUserMenuOpened ? 'show' : 'hide'}
            initial="hide"
            transition={{ duration: 0.2, type: 'tween' }}
          >
            <div className="flex flex-col justify-center px-3 py-1 font-bold leading-4 text-white border-b border-gray-800 cursor-default bg-general rounded-tr-3xl h-11">
              <span>{loggedUser.firstName}</span>
              <span>{loggedUser.secondName}</span>
            </div>
            {getParentDir(router.asPath) === 'cabinet' ? (
              <MenuItem href="/" icon={faHome} title="Главная страница сайта" />
            ) : (
              <MenuItem href="/cabinet" icon={faListAlt} title="Мой кабинет" />
            )}
            <MenuItem
              href="/cabinet/questionnaire"
              icon={faUserAlt}
              title="Моя анкета"
            />
            <MenuItem
              onClick={signOut}
              icon={faSignOutAlt}
              title="Выйти из учетной записи"
            />
          </motion.div>
        )}
      </div>
    </div>
  ) : (
    <>
      {/* <div className="hidden tablet:block ">
        <Link href="/login" shallow>
          <a className="px-2 py-2 text-white border border-white rounded-lg tablet:px-3 hover:text-general hover:bg-white">
          <FontAwesomeIcon icon={faSignInAlt} className="w-7 h-7" /><span>Авторизоваться</span>
          </a>
        </Link>
      </div> */}

      <Link href="/login" shallow>
        <a>
          <div className="flex items-center justify-center h-12 px-2 text-white duration-300 border border-white rounded-lg hover:text-general hover:bg-white">
            <FontAwesomeIcon icon={faSignInAlt} className="w-7 h-7" />
            <span className="hidden ml-2 tablet:block">Авторизоваться</span>
          </div>
        </a>
      </Link>
    </>
  )
}

export default UserMenu
