import DevSwitch from '@components/DevSwitch'
import {
  faHome,
  faSign,
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

const UserMenu = () => {
  const loggedUser = useRecoilValue(loggedUserAtom)
  const setMenuOpen = useSetRecoilState(menuOpenAtom)
  const [isUserMenuOpened, setIsUserMenuOpened] = useState(false)

  const router = useRouter()

  const handleMouseOver = () => {
    setMenuOpen(false)
    setIsUserMenuOpened(true)
  }

  const handleMouseOut = () => setIsUserMenuOpened(false)

  return loggedUser ? (
    <div
      className="z-50 flex items-start justify-end h-16"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div className="relative flex flex-col items-end group mt-2.5 w-12">
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
            <DevSwitch />
            {router.asPath === '/' ? (
              <Link href="/cabinet">
                <a>
                  <div className="flex items-center px-3 py-2 text-black duration-300 bg-white border border-gray-300 cursor-pointer gap-x-2 prevent-select-text hover:bg-gray-500 hover:text-white">
                    <FontAwesomeIcon
                      icon={faUserAlt}
                      className="w-5 h-5 text-general"
                    />
                    <span className="prevent-select-text whitespace-nowrap">
                      {'Мой кабинет'}
                    </span>
                  </div>
                </a>
              </Link>
            ) : (
              <>
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
              </>
            )}

            <div
              onClick={signOut}
              className="flex items-center px-3 py-2 text-black duration-300 bg-white border border-gray-300 cursor-pointer gap-x-2 hover:bg-gray-500 hover:text-white"
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="w-5 h-5 text-general"
              />
              <span className="prevent-select-text whitespace-nowrap">
                Выйти из учетной записи
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  ) : (
    <>
      {/* <div className="hidden tablet:block ">
        <Link href="/login">
          <a className="px-2 py-2 text-white border border-white rounded-lg tablet:px-3 hover:text-general hover:bg-white">
          <FontAwesomeIcon icon={faSignInAlt} className="w-7 h-7" /><span>Авторизоваться</span>
          </a>
        </Link>
      </div> */}

      <Link href="/login">
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
