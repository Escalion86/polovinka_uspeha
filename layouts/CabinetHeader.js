// import DevSwitch from '@components/DevSwitch'
import DevSwitch from '@components/DevSwitch'
import Divider from '@components/Divider'
import Menu from '@components/Menu'
import { faBug } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faUser } from '@fortawesome/free-regular-svg-icons'
// import {
//   faHome,
//   faSignOutAlt,
//   faUserAlt,
// } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import getUserAvatarSrc from '@helpers/getUserAvatarSrc'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
// import menuOpenAtom from '@state/atoms/menuOpen'
// import cn from 'classnames'
// import { motion } from 'framer-motion'
// import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRecoilValue } from 'recoil'
// import { useRouter } from 'next/router'
// import { useState } from 'react'
// import { useRecoilState, useSetRecoilState } from 'recoil'
import UserMenu from './UserMenu'

const CabinetHeader = ({ title = '', titleLink, icon }) => {
  // const setMenuOpen = useSetRecoilState(menuOpenAtom)
  // const [isUserMenuOpened, setIsUserMenuOpened] = useState(false)

  const loggedUser = useRecoilValue(loggedUserAtom)

  // const router = useRouter()

  // console.log('router.asPath', router.asPath)

  // const handleMouseOver = () => {
  //   setMenuOpen(false)
  //   setIsUserMenuOpened(true)
  // }

  // const handleMouseOut = () => setIsUserMenuOpened(false)

  if (!loggedUser) return null

  // const variants = {
  //   show: {
  //     scale: 1,
  //     // width: 'auto',
  //     // height: 'auto',
  //     top: 0,
  //     right: 0,
  //     translateX: 0,
  //     translateY: 0,
  //   },
  //   hide: {
  //     scale: 0,
  //     top: 7,
  //     right: 7,
  //     // width: 0,
  //     // height: 0,
  //     translateX: '50%',
  //     translateY: '-50%',
  //   },
  // }

  return (
    <div
      className="relative z-20 flex items-center justify-end w-full h-16 px-3 text-white bg-black gap-x-2"
      style={{ gridArea: 'header' }}
    >
      {title ? (
        <div className="flex items-center flex-1">
          <Link href="/" shallow>
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
              <Link href={titleLink} shallow>
                <a className="hover:text-gray-300">
                  <h1>{title}</h1>
                </a>
              </Link>
            ) : (
              <h1>{title}</h1>
            )}
          </div>
        </div>
      ) : (
        <div className="absolute z-10 -translate-x-1/2 left-1/2">
          <Link href="/" shallow>
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
      {loggedUser.role === 'dev' && (
        <Menu
          trigger={
            <div className="flex items-center justify-center w-6 h-6">
              <FontAwesomeIcon icon={faBug} className="w-5 h-5 text-white" />
            </div>
          }
        >
          <DevSwitch />
        </Menu>
      )}
      <UserMenu />
    </div>
  )
}

export default CabinetHeader
