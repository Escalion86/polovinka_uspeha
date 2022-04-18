import Burger from '@components/Burger'
import Divider from '@components/Divider'
import menuOpenAtom from '@state/atoms/menuOpen'
import cn from 'classnames'
import Link from 'next/link'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import Avatar from './Avatar'
import UserMenu from './UserMenu'

const MenuItem = ({ text, href = '#' }) => (
  <li>
    <a
      href={href}
      className="cursor-pointer text-general hover:text-gray-300 whitespace-nowrap"
    >
      {text}
    </a>
  </li>
)

const BurgerMenuItem = ({ text, href = '#' }) => {
  const setMenuOpen = useSetRecoilState(menuOpenAtom)
  return (
    <li className="flex flex-1">
      <a
        href={href}
        className="flex-1 px-2 py-1 text-2xl duration-300 rounded cursor-pointer whitespace-nowrap hover:bg-general hover:text-white"
        onClick={() => setMenuOpen(false)}
      >
        {text}
      </a>
    </li>
  )
}

const menu = [
  { name: 'О нас', href: '#about' },
  { name: 'Запись', href: '#timetable' },
  { name: 'Направления', href: '#directions' },
  { name: 'Сертификат', href: '#sertificat' },
  { name: 'Стоимость', href: '#price' },
  { name: 'Отзывы', href: '#otzivi' },
  { name: 'Контакты', href: '#contacts' },
]

const Header = ({ user }) => {
  const menuOpen = useRecoilValue(menuOpenAtom)
  return (
    <div className="h-18">
      <div className="fixed top-0 z-20 flex flex-col items-center justify-between w-full shadow-md ">
        {/* <Header user={user} /> */}
        <div className="z-10 flex items-center justify-center w-full px-2 py-1 tablet:px-4 h-18 bg-general">
          <div className="absolute left-0 tablet:hidden ">
            <Burger />
          </div>
          <div>
            <Link href="/">
              <a>
                <img
                  className="object-contain h-16 phoneH:min-w-min"
                  src={'/img/logo_horizontal.png'}
                  alt="logo"
                  // width={48}
                  // height={48}
                />
              </a>
            </Link>
          </div>

          <div className="absolute hidden phoneH:block right-4">
            <UserMenu user={user} />
          </div>
        </div>
        <ul className="items-center justify-center hidden w-full h-8 text-lg duration-300 bg-white bg-opacity-75 tablet:flex gap-x-4 hover:bg-opacity-100">
          {menu.map(({ name, href }, index) => (
            <MenuItem key={'menuItem' + index} text={name} href={href} />
          ))}
        </ul>
        <div
          className={cn(
            'overflow-hidden tablet:hidden absolute z-0 left-0 top-0 bg-white rounded-br-3xl border-r border-b shadow-2xl border-general duration-300',
            menuOpen ? 'w-60' : 'w-0'
          )}
        >
          <div className="pt-20 pb-4 w-60">
            <div className="flex w-full px-2 pb-2 border-b phoneH:hidden border-general">
              {user ? (
                <Link href="/cabinet">
                  <a className="flex items-center w-full px-1 py-1 text-lg rounded-lg hover:text-white gap-x-2 hover:bg-general">
                    <Avatar user={user} />
                    <span>Мой кабинет</span>
                  </a>
                </Link>
              ) : (
                <Link href="/login">
                  <a className="w-full py-2 text-lg text-center border border-white rounded-lg flexpx-2 text-general tablet:px-3 hover:text-white hover:bg-general">
                    Авторизоваться
                  </a>
                </Link>
              )}
            </div>
            <div className="px-2 py-2 w-60 phoneH:py-0">
              <ul className="flex flex-col gap-y-2">
                {menu.map(({ name, href }, index) => (
                  <BurgerMenuItem
                    key={'burgerMenuItem' + index}
                    text={name}
                    href={href}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
