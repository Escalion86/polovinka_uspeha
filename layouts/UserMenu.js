import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Avatar from './Avatar'

const UserMenu = ({ user }) => {
  return user ? (
    <div className="z-10 flex items-start justify-end h-16">
      <div className="relative flex flex-col items-end group mt-2.5 w-12">
        <Avatar user={user} />
        <div className="w-0 h-0 overflow-hidden duration-300 scale-0 translate-x-1/2 -translate-y-1/2 group-hover:w-auto group-hover:h-auto group-hover:translate-y-0 group-hover:translate-x-0 group-hover:scale-100 top-12">
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
    <div>
      <Link href="/login">
        <a className="px-2 py-2 text-white border border-white rounded-lg tablet:px-3 hover:text-general hover:bg-white">
          Авторизоваться
        </a>
      </Link>
    </div>
  )
}

export default UserMenu
