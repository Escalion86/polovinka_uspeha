import { faBell } from '@fortawesome/free-solid-svg-icons/faBell'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkerAlt'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt'
import { faUserAlt } from '@fortawesome/free-solid-svg-icons/faUserAlt'
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons/faCalendarAlt'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import menuOpenAtom from '@state/atoms/menuOpen'
import cn from 'classnames'
import { m } from 'framer-motion'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import Avatar from './Avatar'
import SvgKavichki from '@svg/SvgKavichki'
import modalsFuncAtom from '@state/modalsFuncAtom'
import locationAtom from '@state/atoms/locationAtom'
import useRouter from '@utils/useRouter'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { LOCATIONS } from '@helpers/constants'

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

const getCityTitle = (slug) => LOCATIONS?.[slug]?.townRu || String(slug || '').toUpperCase()
const formatCityTitle = (value) => {
  const title = String(value || '').trim()
  if (!title) return ''
  return `${title.charAt(0).toUpperCase()}${title.slice(1)}`
}

const SwitchCityModalContent = ({
  cities = [],
  currentCity,
  onSelectCity,
  closeModal,
  isSwitching,
}) => (
  <div className="flex flex-col gap-y-2">
    <div className="text-sm text-[#4b3a40]">
      Выберите город для продолжения работы:
    </div>
    <div className="flex flex-col gap-y-2">
      {cities.map((city) => (
        <button
          key={city}
          type="button"
          disabled={isSwitching}
          onClick={async () => {
            await onSelectCity(city)
            closeModal()
          }}
          className="flex items-center justify-between rounded-xl border border-[#f0e2e8] bg-white px-3 py-2 text-left text-[#6b1f2a] transition-colors hover:bg-[#6b1f2a] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="font-medium">{formatCityTitle(getCityTitle(city))}</span>
          {city === currentCity ? (
            <span className="text-xs opacity-80">Текущий</span>
          ) : null}
        </button>
      ))}
    </div>
  </div>
)

const MenuItem = ({ onClick, icon, title, href, disabled = false }) => {
  const content = (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center px-3 py-2 duration-300 bg-white border border-gray-300 group gap-x-2',
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer hover:bg-gray-500'
      )}
    >
      <FontAwesomeIcon
        icon={icon}
        className={cn(
          'w-5 h-5 min-h-5 text-general',
          !disabled && 'group-hover:text-white'
        )}
      />
      <span
        className={cn(
          'text-black prevent-select-text whitespace-nowrap',
          !disabled && 'group-hover:text-white'
        )}
      >
        {title}
      </span>
    </div>
  )

  if (href && !disabled)
    return (
      <Link prefetch={false} href={href} shallow>
        {content}
      </Link>
    )

  return content
}

const UserMenu = () => {
  const router = useRouter()
  const { data: session, update } = useSession()
  const query = { ...router.query }
  delete query.location
  const location = useAtomValue(locationAtom)
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const setMenuOpen = useSetAtom(menuOpenAtom)
  const [isUserMenuOpened, setIsUserMenuOpened] = useState(false)
  const [turnOnHandleMouseOver, setTurnOnHandleMouseOver] = useState(true)
  const [isSwitchingLocation, setIsSwitchingLocation] = useState(false)
  const [activeCitiesByPolicy, setActiveCitiesByPolicy] = useState([])
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)

  const notificationsVisible =
    (loggedUserActiveRole?.notifications?.newEvents ??
      loggedUserActiveRole?.notifications?.newEventsByTags) ||
    loggedUserActiveRole?.notifications?.birthdays ||
    loggedUserActiveRole?.notifications?.newUserRegistred ||
    loggedUserActiveRole?.notifications?.eventRegistration

  const allLocations = Object.keys(LOCATIONS || {})
  const sessionCitiesRaw = Array.isArray(session?.user?.cities)
    ? session.user.cities
    : []
  const activeUserCitiesRaw = Array.isArray(loggedUserActive?.cities)
    ? loggedUserActive.cities
    : []
  const userCitiesRaw =
    sessionCitiesRaw.length > 0 ? sessionCitiesRaw : activeUserCitiesRaw
  const userCities = Array.from(new Set([...userCitiesRaw, location])).filter(
    (city) => allLocations.includes(city)
  )
  const baseVisibleCities =
    loggedUserActive?.role === 'dev' && userCities.length <= 1
      ? allLocations
      : userCities

  const activeCitiesSet =
    activeCitiesByPolicy.length > 0 ? new Set(activeCitiesByPolicy) : null
  const isActiveCity = (city) => (activeCitiesSet ? activeCitiesSet.has(city) : true)

  const selectableCities = baseVisibleCities.filter(
    (city) => allLocations.includes(city) && isActiveCity(city)
  )
  const visibleCities = Array.from(new Set([location, ...selectableCities]))
  const alternativeCities = selectableCities.filter((city) => city !== location)

  useEffect(() => {
    let isMounted = true

    const loadActiveCities = async () => {
      try {
        const response = await fetch('/api/global/cities/public')
        const json = await response.json()
        if (!isMounted || !json?.success) return

        const activeSlugs = (Array.isArray(json?.data?.cities) ? json.data.cities : [])
          .filter((city) => city?.status === 'active')
          .map((city) => city?.slug)
          .filter(Boolean)

        setActiveCitiesByPolicy(activeSlugs)
      } catch {
        // fallback: keep current list without policy filter
      }
    }

    loadActiveCities()

    return () => {
      isMounted = false
    }
  }, [])

  const buildSameCabinetPathForCity = (city) => {
    const currentPath = String(router?.asPath || '')
    const currentPrefix = `/${location}`
    if (currentPath.startsWith(currentPrefix)) {
      const suffix = currentPath.slice(currentPrefix.length)
      return `/${city}${suffix || '/cabinet/eventsUpcoming'}`
    }
    return `/${city}/cabinet/eventsUpcoming`
  }

  const switchCity = async (city) => {
    if (!city || city === location || isSwitchingLocation) return
    setIsSwitchingLocation(true)
    try {
      await update({ location: city })
      router.push(buildSameCabinetPathForCity(city), '', { shallow: true })
    } finally {
      setIsSwitchingLocation(false)
    }
  }

  const openSwitchCityModal = () => {
    if (alternativeCities.length === 0) return
    modalsFunc.custom({
      title: 'Смена города',
      confirmButtonShow: false,
      declineButtonShow: false,
      onlyCloseButtonShow: true,
      closeButtonName: 'Закрыть',
      Children: ({ closeModal }) => (
        <SwitchCityModalContent
          cities={alternativeCities}
          currentCity={location}
          onSelectCity={switchCity}
          closeModal={closeModal}
          isSwitching={isSwitchingLocation}
        />
      ),
    })
  }

  // const router = useRouter()

  const handleMouseOver = () => {
    if (turnOnHandleMouseOver) {
      setMenuOpen(false)
      setIsUserMenuOpened(true)
    }
  }

  const handleMouseOut = () => setIsUserMenuOpened(false)

  return loggedUserActive ? (
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
        <Avatar user={loggedUserActive} className="z-10" />
        <m.div
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
            <span>{loggedUserActive.firstName}</span>
            <span>{loggedUserActive.secondName}</span>
          </div>
          <div
            className="relative bg-white border-b-2 cursor-pointer group border-general min-h-12"
            onClick={() =>
              modalsFunc.user.editPersonalStatus(loggedUserActive._id)
            }
          >
            {loggedUserActive.personalStatus ? (
              <>
                <div className="relative flex items-center justify-center px-5 py-2 text-sm italic leading-4 text-center text-black duration-300 opacity-100 group-hover:opacity-20 border-general min-h-12">
                  <SvgKavichki className="absolute w-3 h-3 bottom-1 left-1 fill-general" />
                  {loggedUserActive.personalStatus}
                  <SvgKavichki className="absolute w-3 h-3 rotate-180 top-1 right-1 fill-general" />
                </div>
                <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center duration-300 group-hover:text-general text-general/0">
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
              href="/cabinet/eventsUpcoming"
              icon={faCalendarAlt}
              title="Мероприятия"
            /> */}
          <MenuItem
            href={`/${location}/cabinet/questionnaire`}
            icon={faUserAlt}
            title="Моя анкета"
          />
          {notificationsVisible && (
            <MenuItem
              href={`/${location}/cabinet/notifications`}
              icon={faBell}
              title="Настройка уведомлений"
            />
          )}
          <MenuItem
            href={`/${location}/cabinet/googleCalendarIntegration`}
            icon={faCalendarAlt}
            title="Интеграция Google календаря"
          />
          {visibleCities.length > 1 && (
            <MenuItem
              onClick={openSwitchCityModal}
              icon={faMapMarkerAlt}
              title={`Сменить город: ${formatCityTitle(getCityTitle(location))}`}
              disabled={isSwitchingLocation}
            />
          )}
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
        </m.div>
        {/* )} */}
      </div>
    </div>
  ) : (
    <Link
      prefetch={false}
      href={{
        pathname: `/${location}/login`,
        query,
      }}
      shallow
      className="flex items-center justify-center h-12 px-2 text-white duration-300 border border-white rounded-lg hover:text-general hover:bg-white"
    >
      <FontAwesomeIcon icon={faSignInAlt} className="w-7 h-7" />
      <span className="ml-2 tablet:block">Авторизоваться</span>
    </Link>
  )
}

export default UserMenu
