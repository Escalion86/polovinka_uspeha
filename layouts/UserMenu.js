import { faSign, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Avatar from './Avatar'

const UserMenu = ({ user }) => {
  return user ? (
    <div className="z-10 flex items-start justify-end h-16">
      <div className="relative flex flex-col items-end group mt-2.5 w-12">
        <Avatar user={user} className="z-10" />

        <div className="border border-gray-800 rounded-tr-3xl absolute top-0 w-0 h-0 overflow-hidden duration-300 scale-0 translate-x-[40%] -translate-y-1/2 group-hover:w-auto group-hover:h-auto group-hover:translate-y-0 group-hover:translate-x-0 group-hover:scale-100">
          <div className="flex flex-col justify-center px-3 py-1 font-bold leading-4 text-white border-b border-gray-800 cursor-default bg-general rounded-tr-3xl h-11">
            <span>{user.name}</span>
            <span>{user.secondName}</span>
          </div>
          <Link href="/cabinet">
            <a>
              <div className="px-3 py-2 text-black bg-white border border-gray-300 cursor-pointer whitespace-nowrap hover:bg-gray-500 hover:text-white">
                Мой кабинет
              </div>
            </a>
          </Link>

          <div
            onClick={signOut}
            className="px-3 py-2 text-black bg-white border border-gray-300 cursor-pointer whitespace-nowrap hover:bg-gray-500 hover:text-white"
          >
            Выйти из учетной записи
          </div>
        </div>
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
