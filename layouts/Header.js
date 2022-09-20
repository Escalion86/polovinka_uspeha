import Burger from '@components/Burger'
import Divider from '@components/Divider'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import transliterate from '@helpers/transliterate'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import menuOpenAtom from '@state/atoms/menuOpen'
import filteredAdditionalBlocksSelector from '@state/selectors/filteredAdditionalBlocksSelector'
import filteredDirectionsSelector from '@state/selectors/filteredDirectionsSelector'
import filteredEventsSelector from '@state/selectors/filteredEventsSelector'
import filteredReviewsSelector from '@state/selectors/filteredReviewsSelector'
import cn from 'classnames'
import Link from 'next/link'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import Avatar from './Avatar'
import UserMenu from './UserMenu'

const MenuItem = ({ text, href = '#' }) => (
  <li>
    <a
      href={href}
      className="cursor-pointer first-letter:uppercase text-general hover:text-gray-300"
    >
      <p className="first-letter:uppercase whitespace-nowrap">{text}</p>
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

// const menu = [
//   { name: 'О нас', href: '#about', key: null },
//   { name: 'Запись', href: '#timetable', key: 'events' },
//   { name: 'Направления', href: '#directions', key: 'directions' },
//   // { name: 'Доп. блоки', href: '#additionalBlock', key: 'additionalBlocks' },
//   // { name: 'Стоимость', href: '#price', key: null },
//   { name: 'Отзывы', href: '#reviews', key: 'reviews' },
//   { name: 'Контакты', href: '#contacts', key: null },
// ]

const Header = () => {
  const loggedUser = useRecoilValue(loggedUserAtom)
  const events = useRecoilValue(filteredEventsSelector)
  const reviews = useRecoilValue(filteredReviewsSelector)
  const directions = useRecoilValue(filteredDirectionsSelector)
  const additionalBlocks = useRecoilValue(filteredAdditionalBlocksSelector)

  const menu = [{ name: 'Наши цели', href: '/#about' }]
  if (events?.length > 0) menu.push({ name: 'Мероприятия', href: '/#events' })
  if (directions?.length > 0)
    menu.push({ name: 'Направления', href: '/#directions' })
  if (additionalBlocks?.length > 0)
    additionalBlocks.forEach((additionalBlock) => {
      if (additionalBlock.menuName)
        menu.push({
          name: additionalBlock.menuName,
          href: '/#' + transliterate(additionalBlock.menuName),
        })
    })
  if (reviews?.length > 0) menu.push({ name: 'Отзывы', href: '/#reviews' })
  menu.push({ name: 'Контакты', href: '/#contacts' })

  // const filteredMenu = menu.filter(
  //   (menuItem) =>
  //     !menuItem.key || (props[menuItem.key] && props[menuItem.key].length > 0)
  // )

  const menuOpen = useRecoilValue(menuOpenAtom)
  return (
    // <div className="w-full h-18">
    <div className="sticky top-0 left-0 right-0 z-20 flex flex-col items-center justify-between shadow-md h-18 min-h-[4.5rem]">
      {/* <Header user={user} /> */}
      <div className="z-10 flex items-center justify-end w-full px-2 py-1 tablet:px-4 h-18 min-h-[4.5rem] bg-general">
        <div className="flex-1 tablet:hidden ">
          <Burger />
        </div>
        <div className="absolute z-10 -translate-x-1/2 left-1/2">
          <Link href="/" shallow>
            <a>
              <img
                className="object-contain h-16 tablet:min-w-min"
                src={'/img/logo_horizontal.png'}
                alt="logo"
                // width={48}
                // height={48}
              />
            </a>
          </Link>
        </div>

        <UserMenu />
      </div>
      <ul className="items-center justify-center hidden w-full h-[40px] text-lg duration-300 bg-white bg-opacity-75 tablet:flex gap-x-4 hover:bg-opacity-100">
        {menu.map(({ name, href }, index) => {
          return <MenuItem key={'menuItem' + name} text={name} href={href} />
        })}
      </ul>
      <div
        className={cn(
          'overflow-hidden tablet:hidden absolute z-0 left-0 top-0 bg-white rounded-br-3xl border-r border-b shadow-2xl border-general duration-300',
          menuOpen ? 'w-60' : 'w-0'
        )}
      >
        <div className="pt-20 pb-4 w-60">
          <div className="flex w-full px-2 pb-2 border-b tablet:hidden border-general">
            {loggedUser?._id ? (
              <Link href="/cabinet" shallow>
                <a className="flex items-center w-full px-1 py-1 text-lg rounded-lg hover:text-white gap-x-2 hover:bg-general">
                  <Avatar user={loggedUser} />
                  <span className="prevent-select-text">Мой кабинет</span>
                </a>
              </Link>
            ) : (
              <Link href="/login" shallow>
                <a className="flex items-center w-full px-2 py-2 text-lg text-center border border-white rounded-lg gap-x-2 flexpx-2 text-general tablet:px-3 hover:text-white hover:bg-general">
                  <FontAwesomeIcon icon={faSignInAlt} className="w-6 h-6" />
                  <span className="prevent-select-text">Авторизоваться</span>
                </a>
              </Link>
            )}
          </div>
          <div className="px-2 py-2 w-60 tablet:py-0">
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
    // </div>
  )
}

export default Header
