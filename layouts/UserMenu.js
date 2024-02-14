import {
  faBell,
  // faHome,
  // faListAlt,
  faSignInAlt,
  faSignOutAlt,
  faUserAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import getParentDir from '@state/atoms/getParentDir'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import menuOpenAtom from '@state/atoms/menuOpen'
import cn from 'classnames'
import { motion } from 'framer-motion'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
// import { useRouter } from 'next/router'
import { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import Avatar from './Avatar'
import SvgKavichki from 'svg/SvgKavichki'
import { modalsFuncAtom } from '@state/atoms'
// import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'

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
        {Component}
      </Link>
    )
  else return Component
}

const UserMenu = () => {
  const loggedUser = useRecoilValue(loggedUserAtom)
  const setMenuOpen = useSetRecoilState(menuOpenAtom)
  const [isUserMenuOpened, setIsUserMenuOpened] = useState(false)
  const [turnOnHandleMouseOver, setTurnOnHandleMouseOver] = useState(true)
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  // const router = useRouter()

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
        {/* {router && ( */}
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
          <div
            className="relative bg-white border-b-2 cursor-pointer group border-general min-h-[3rem]"
            onClick={() => modalsFunc.user.editPersonalStatus(loggedUser._id)}
          >
            {loggedUser.personalStatus ? (
              <>
                <div className="relative flex items-center justify-center px-5 py-2 text-sm italic leading-4 text-center text-black duration-300 opacity-100 group-hover:opacity-20 border-general min-h-[3rem]">
                  <SvgKavichki className="absolute w-3 h-3 bottom-1 left-1 fill-general" />
                  {loggedUser.personalStatus}
                  <SvgKavichki className="absolute w-3 h-3 rotate-180 top-1 right-1 fill-general" />
                </div>
                <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center text-opacity-0 duration-300 group-hover:text-opacity-100 text-general">
                  Изменить статус
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center px-5 py-2 text-sm leading-4 text-center text-general">
                <div className="font-bold">Статус не указан!</div>
                <div className="italic">Нажмите, чтобы указать</div>
              </div>
            )}
          </div>
          {/* <MenuItem
              href="/cabinet/events"
              icon={faCalendarAlt}
              title="Мероприятия"
            /> */}
          <MenuItem
            href="/cabinet/questionnaire"
            icon={faUserAlt}
            title="Моя анкета"
          />
          <MenuItem
            href="/cabinet/notifications"
            icon={faBell}
            title="Настройка уведомлений"
          />
          {/* {getParentDir(router.asPath) === 'cabinet' && (
              <MenuItem href="/" icon={faHome} title="Главная страница сайта" />
            )} */}
          {/* {getParentDir(router.asPath) === 'cabinet' ? (
              <MenuItem href="/" icon={faHome} title="Главная страница сайта" />
            ) : (
              <MenuItem href="/cabinet" icon={faListAlt} title="Мой кабинет" />
            )} */}
          <MenuItem
            onClick={signOut}
            icon={faSignOutAlt}
            title="Выйти из учетной записи"
          />
        </motion.div>
        {/* )} */}
      </div>
    </div>
  ) : (
    <Link
      href="/login"
      shallow
      className="flex items-center justify-center h-12 px-2 text-white duration-300 border border-white rounded-lg hover:text-general hover:bg-white"
    >
      <FontAwesomeIcon icon={faSignInAlt} className="w-7 h-7" />
      <span className="hidden ml-2 tablet:block">Авторизоваться</span>
    </Link>
  )
}

export default UserMenu
