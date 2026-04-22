'use client'

import ContactsBlock from '@blocks/ContactsBlock'
import EventsBlock from '@blocks/EventsBlock'
import FooterBlock from '@blocks/FooterBlock'
import FabMenu from '@components/FabMenu'
import StateLoader from '@components/StateLoader'
import Header from '@layouts/Header'
import isPWAAtom from '@state/atoms/isPWAAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import useRouter from '@utils/useRouter'
import { useAtomValue } from 'jotai'
import { useEffect, useMemo } from 'react'
import CityAccessLoading from '@components/CityAccessLoading'
import CityAccessUnavailable from '@components/CityAccessUnavailable'
import useCityAccess from '@hooks/useCityAccess'

function LocationEventsClient(props) {
  const { location } = props
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const hideFab = loggedUserActiveRole?.hideFab
  const isPWA = useAtomValue(isPWAAtom)
  const router = useRouter()
  const {
    accessLoading,
    isAllowed: isEventSignupAllowed,
    currentCityTitle,
    alternativeCities: alternativeEventCities,
  } = useCityAccess({
    location: props.location,
    allowField: 'allowEventSignup',
    alternativesField: 'availableForEventSignup',
  })

  const query = useMemo(() => {
    const newQuery = { ...router.query }
    delete newQuery.location
    return newQuery
  }, [router])

  if (isPWA) {
    router.push(
      {
        pathname: `/${location}/login`,
        query,
      },
      undefined,
      { shallow: true }
    )
    return null
  }

  if (accessLoading) {
    return (
      <StateLoader {...props}>
        <Header />
        <div className="mx-auto my-8 flex justify-center px-4">
          <CityAccessLoading
            message="Проверяем доступность записи на мероприятия..."
            className="max-w-[900px]"
          />
        </div>
        <FooterBlock />
      </StateLoader>
    )
  }

  if (!isEventSignupAllowed) {
    return (
      <StateLoader {...props}>
        <Header />
        <div className="mx-auto my-8 max-w-[900px] px-4">
          <CityAccessUnavailable
            heading="Запись на мероприятия приостановлена"
            description="запись на мероприятия временно недоступна. Вы можете посмотреть мероприятия в других городах, где запись открыта."
            cityTitle={currentCityTitle}
            location={location}
            cities={alternativeEventCities}
            buildCityHref={(slug) => `/${slug}/events`}
            emptyMessage="Сейчас нет других публичных городов с открытой записью."
            showHomeLink={false}
            className="max-w-[900px]"
          />
        </div>
        <ContactsBlock />
        <FooterBlock />
      </StateLoader>
    )
  }

  return (
    <StateLoader {...props}>
      <Header />
      <EventsBlock />
      <ContactsBlock />
      <FooterBlock />
      <FabMenu show={!hideFab} />
    </StateLoader>
  )
}

export default LocationEventsClient
