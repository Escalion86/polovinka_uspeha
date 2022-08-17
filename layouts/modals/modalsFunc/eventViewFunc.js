import React from 'react'

import { useRecoilValue } from 'recoil'
import eventSelector from '@state/selectors/eventSelector'

import ImageGallery from 'react-image-gallery'

import formatAddress from '@helpers/formatAddress'
import formatDateTime from '@helpers/formatDateTime'
import getDaysFromNow from '@helpers/getDaysFromNow'
import UserName from '@components/UserName'
import directionSelector from '@state/selectors/directionSelector'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import userSelector from '@state/selectors/userSelector'
import EventUsersCounterAndAge from '@components/EventUsersCounterAndAge'
import PriceDiscount from '@components/PriceDiscount'
import Divider from '@components/Divider'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'

import formatMinutes from '@helpers/formatMinutes'
import EventButtonSignIn from '@components/EventButtonSignIn'

const eventViewFunc = (eventId, clone = false) => {
  const EventSignUpModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
  }) => {
    const event = useRecoilValue(eventSelector(eventId))
    const direction = useRecoilValue(directionSelector(event.directionId))
    const organizer = useRecoilValue(userSelector(event.organizerId))

    const eventAssistants = useRecoilValue(eventAssistantsSelector(eventId))

    return (
      <div className="flex flex-col gap-y-2">
        {event?.images && event.images.length > 0 && (
          <div className="flex justify-center w-full border border-gray-400 h-60 laptop:h-80">
            <ImageGallery
              items={event.images.map((image) => {
                return {
                  original: image,
                  originalClass: 'object-contain max-h-60 laptop:max-h-80',
                  // sizes: '(max-width: 60px) 30px, (min-width: 60px) 60px',
                }
              })}
              showPlayButton={false}
              showFullscreenButton={false}
              additionalClass="w-full max-h-60 laptop:max-h-80 max-w-full"
            />
          </div>
        )}
        <div className="flex flex-col flex-1">
          <div className="flex flex-col flex-1 px-2 py-2">
            <div className="flex justify-center w-full text-3xl font-bold">
              {event.title}
            </div>
            <p className="flex-1">{event.description}</p>
            <Divider thin light />
            {direction?.title && (
              <div className="flex gap-x-1">
                <span className="font-bold">Направление:</span>
                <span>{direction.title}</span>
              </div>
            )}
            <div className="flex items-center leading-5 gap-x-1">
              <span className="font-bold">Начало:</span>
              <div>{formatDateTime(event.date)}</div>
              <div className="font-normal">({getDaysFromNow(event.date)})</div>
            </div>
            <div className="flex items-center leading-5 gap-x-1">
              <span className="font-bold">Продолжительность:</span>
              <div>{formatMinutes(event.duration ?? 60)}</div>
            </div>

            {event.address && (
              <div className="flex items-center gap-x-1">
                <span className="font-bold">Адрес:</span>{' '}
                {formatAddress(event.address, '[не указан]')}
                {event.address?.town && event.address?.street && (
                  <>
                    <a
                      data-tip="Открыть адрес в 2ГИС"
                      href={`https://2gis.ru/search/${event.address.town},%20${event.address.street}%20${event.address.house}`}
                    >
                      <img
                        className="h-6"
                        src="/img/navigators/2gis.png"
                        alt="2gis"
                      />
                    </a>
                    <a
                      className="laptop:hidden"
                      data-tip="Открыть адрес в Яндекс Навигаторе"
                      href={`yandexnavi://map_search?text=${event.address.town},%20${event.address.street}%20${event.address.house}`}
                    >
                      <img
                        className="h-6"
                        src="/img/navigators/yandex.png"
                        alt="2gis"
                      />
                    </a>
                  </>
                )}
              </div>
            )}
            {event.organizerId && (
              <div className="flex items-center leading-5 gap-x-1">
                <span className="font-bold">Организатор:</span>
                <div className="flex flex-wrap items-center gap-1">
                  <UserName user={organizer} noWrap />
                  <ContactsIconsButtons user={organizer} />
                </div>
              </div>
            )}
            {eventAssistants &&
              typeof eventAssistants === 'object' &&
              eventAssistants.length > 0 && (
                <div className="flex leading-5 gap-x-1">
                  <span className="font-bold">
                    {eventAssistants.length > 1 ? 'Ведущие:' : 'Ведущий:'}
                  </span>
                  <div className="flex flex-wrap gap-x-1">
                    {eventAssistants.map((user, index) => {
                      if (index < eventAssistants.length - 1) {
                        return (
                          <div
                            className="flex flex-wrap"
                            key={'assistant' + index}
                          >
                            <UserName user={user} noWrap />
                            <span>,</span>
                          </div>
                        )
                      } else
                        return (
                          <UserName user={user} key={'assistant' + index} />
                        )
                    })}
                  </div>
                </div>
              )}
          </div>
          <EventUsersCounterAndAge eventId={eventId} />
          {/* <Divider thin light /> */}

          {/* <div className="flex flex-wrap justify-center flex-1 px-4 text-lg font-bold gap-x-1 text-general">
            <div>{formatDateTime(event.date)}</div>
            <div className="font-normal">({getDaysFromNow(event.date)})</div>
          </div> */}
          <Divider thin light />
          <div className="flex flex-col items-center w-full phoneH:justify-between phoneH:flex-row">
            <PriceDiscount event={event} className="px-2" prefix="Стоимость:" />
            <EventButtonSignIn eventId={event._id} />
          </div>
        </div>
      </div>
    )
  }

  return {
    title: `Запись на мероприятие`,
    confirmButtonName: 'Записаться',
    Children: EventSignUpModal,
  }
}

export default eventViewFunc
