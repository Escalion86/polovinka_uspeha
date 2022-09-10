import DevSwitch from '@components/DevSwitch'
import Divider from '@components/Divider'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import {
  faHome,
  faSignOutAlt,
  faUserAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import getUserAvatarSrc from '@helpers/getUserAvatarSrc'
import menuOpenAtom from '@state/atoms/menuOpen'
import cn from 'classnames'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'

const CabinetHeader = ({ user, title = '', titleLink, icon }) => {
  const setMenuOpen = useSetRecoilState(menuOpenAtom)
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseOver = () => {
    setMenuOpen(false)
    setIsHovering(true)
  }

  const handleMouseOut = () => setIsHovering(false)

  if (!user) return null

  return (
    <div
      className="relative flex items-center justify-end w-full h-16 px-3 text-white bg-black"
      style={{ gridArea: 'header' }}
    >
      {title && (
        <>
          <Link href="/">
            <a className="hidden tablet:block">
              <img
                className="rounded-full h-14"
                src={icon || '/img/logo_heart.png'}
                alt="logo"
                // width={48}
                // height={48}
              />
            </a>
          </Link>
          <div className="flex flex-1">
            <Divider type="vertical" className="hidden tablet:block" />
            {titleLink ? (
              <Link href={titleLink}>
                <a className="hover:text-gray-300">
                  <h1>{title}</h1>
                </a>
              </Link>
            ) : (
              <h1>{title}</h1>
            )}
          </div>
        </>
      )}
      {!title && (
        <div className="absolute z-10 -translate-x-1/2 left-1/2">
          <Link href="/">
            <a>
              <img
                className="h-12"
                src="/img/logo_horizontal.png"
                alt="logo"
                // width={40}
                // height={40}
              />
            </a>
          </Link>
        </div>
      )}
      <div className="z-10 flex items-start justify-end h-full px-2">
        <div
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          className="relative flex flex-col items-end group mt-2.5 w-12"
        >
          <img
            onClick={() => setMenuOpen(false)}
            className="absolute z-10 object-cover border border-white border-opacity-50 rounded-full cursor-pointer h-11 w-11 min-w-9"
            src={getUserAvatarSrc(user)}
            alt="Avatar"
          />
          <div
            className={cn(
              'absolute top-0 z-0 w-0 h-0 overflow-hidden duration-300 scale-0 translate-x-[40%] -translate-y-1/2 border border-gray-800 rounded-tr-3xl',
              {
                'scale-100 h-auto translate-y-0 translate-x-0 w-auto':
                  isHovering,
              }
            )}
          >
            <div className="flex flex-col justify-center px-3 py-1 font-bold leading-4 text-white border-b border-gray-800 cursor-default bg-general rounded-tr-3xl h-11">
              <span>{user.firstName}</span>
              <span>{user.secondName}</span>
            </div>
            {/* <Link href="/cabinet">
                <a onClick={() => setMenuOpen(false)}>
                  <div className="px-3 py-2 text-black bg-white border border-gray-300 cursor-pointer whitespace-nowrap hover:bg-gray-500 hover:text-white">
                    Мой кабинет
                  </div>
                </a>
              </Link> */}
            <DevSwitch />
            <Link href="/cabinet/questionnaire">
              <a onClick={() => setMenuOpen(false)}>
                <div className="flex items-center px-3 py-2 text-black duration-300 bg-white border border-gray-300 cursor-pointer gap-x-2 prevent-select-text hover:bg-gray-500 hover:text-white">
                  <FontAwesomeIcon
                    icon={faUserAlt}
                    className="w-5 h-5 text-general"
                  />
                  <span className="prevent-select-text whitespace-nowrap">
                    {'Моя анкета'}
                  </span>
                </div>
              </a>
            </Link>
            <Link href="/">
              <a onClick={() => setMenuOpen(false)}>
                <div className="flex items-center px-3 py-2 text-black duration-300 bg-white border border-gray-300 cursor-pointer gap-x-2 prevent-select-text hover:bg-gray-500 hover:text-white">
                  <FontAwesomeIcon
                    icon={faHome}
                    className="w-5 h-5 text-general"
                  />
                  <span className="prevent-select-text whitespace-nowrap">
                    {'Главная страница сайта'}
                  </span>
                </div>
              </a>
            </Link>

            <div
              onClick={() => {
                setMenuOpen(false)
                signOut()
              }}
              className="flex items-center px-3 py-2 text-black duration-300 bg-white border border-gray-300 cursor-pointer gap-x-2 hover:bg-gray-500 hover:text-white"
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="w-5 h-5 text-general"
              />
              <span className="prevent-select-text whitespace-nowrap">
                {'Выйти из учетной записи'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CabinetHeader
