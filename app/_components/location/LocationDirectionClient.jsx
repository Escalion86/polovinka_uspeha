'use client'

import ContactsBlock from '@blocks/ContactsBlock'
import DirectionBlock from '@blocks/DirectionBlock'
import FooterBlock from '@blocks/FooterBlock'
import BlockContainer from '@components/BlockContainer'
import FabMenu from '@components/FabMenu'
import StateLoader from '@components/StateLoader'
import SignOut from '@components/SignOut'
import { P } from '@components/tags'
import isEventCanceledFunc from '@helpers/isEventCanceled'
import isEventExpiredFunc from '@helpers/isEventExpired'
import Header from '@layouts/Header'
import isPWAAtom from '@state/atoms/isPWAAtom'
import directionSelector from '@state/selectors/directionSelector'
import filteredEventsSelector from '@state/selectors/filteredEventsSelector'
import filteredServicesSelector from '@state/selectors/filteredServicesSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import useRouter from '@utils/useRouter'
import dynamic from 'next/dynamic'
import { useAtomValue } from 'jotai'
import { useEffect, useMemo } from 'react'
import CountDown from '@blocks/components/CountDown'

const EventCard = dynamic(() => import('@layouts/cards/EventCard'))
const ServiceCard = dynamic(() => import('@layouts/cards/ServiceCard'))

const sortByIndexAndTitle = (a, b) => {
  const indexA = typeof a.index === 'number' ? a.index : null
  const indexB = typeof b.index === 'number' ? b.index : null

  if (indexA === null && indexB === null) {
    return (a.title ?? '').localeCompare(b.title ?? '')
  }
  if (indexA === null) return 1
  if (indexB === null) return -1
  if (indexA === indexB) {
    return (a.title ?? '').localeCompare(b.title ?? '')
  }
  return indexA - indexB
}

function LocationDirectionClient(props) {
  const { location, directionId } = props
  const isPWA = useAtomValue(isPWAAtom)
  const router = useRouter()
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const hideFab = loggedUserActiveRole?.hideFab

  const direction = useAtomValue(directionSelector(directionId))
  const services = useAtomValue(filteredServicesSelector)
  const events = useAtomValue(filteredEventsSelector)

  const directionServices = useMemo(
    () =>
      (services ?? [])
        .filter((service) => service.directionId === directionId)
        .sort(sortByIndexAndTitle),
    [services, directionId]
  )

  const directionEvents = useMemo(
    () =>
      (events ?? [])
        .filter(
          (event) =>
            event.directionId === directionId &&
            !isEventExpiredFunc(event) &&
            !isEventCanceledFunc(event) &&
            !event.blank
        )
        .sort((a, b) => (a.dateStart < b.dateStart ? -1 : 1)),
    [events, directionId]
  )

  useEffect(() => {
    if (isPWA) {
      router.push(
        {
          pathname: `/${location}/login`,
        },
        undefined,
        { shallow: true }
      )
    }
  }, [isPWA, location, router])

  if (props.wrongSession) return <SignOut />
  if (isPWA) return null

  return (
    <StateLoader {...props}>
      <Header />
      {direction?._id ? (
        <DirectionBlock
          id="direction"
          title={direction.title}
          description={direction.description}
        />
      ) : (
        <BlockContainer small>
          <P className="flex justify-center w-full">
            Пространство не найдено
          </P>
        </BlockContainer>
      )}

      {directionServices.length > 0 && (
        <BlockContainer id="direction-services" title="Услуги Пространства">
          <div className="flex flex-col w-full gap-4">
            {directionServices.map((service) => (
              <ServiceCard key={service._id} serviceId={service._id} />
            ))}
          </div>
        </BlockContainer>
      )}

      <BlockContainer id="direction-events" title="Мероприятия Пространства">
        {directionEvents.length > 0 ? (
          <div className="flex flex-col items-center w-full gap-4">
            {directionEvents.map((event) => (
              <EventCard key={event._id} eventId={event._id} />
            ))}
          </div>
        ) : (
          <CountDown>
            <P className="flex justify-center w-full">
              Мероприятий не запланировано
            </P>
          </CountDown>
        )}
      </BlockContainer>

      <ContactsBlock />
      <FooterBlock />
      <FabMenu show={!hideFab} />
    </StateLoader>
  )
}

export default LocationDirectionClient

