import React from 'react'

import { useRecoilValue } from 'recoil'
import eventSelector from '@state/selectors/eventSelector'

import ImageGallery from 'react-image-gallery'

import { P } from '@components/tags'
import Button from '@components/Button'

import formatAddress from '@helpers/formatAddress'
import formatDateTime from '@helpers/formatDateTime'
import getDaysFromNow from '@helpers/getDaysFromNow'
import { modalsFuncAtom } from '@state/atoms'
import eventsUsersSelectorByEventId from '@state/selectors/eventsUsersByEventIdSelector'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import UserName from '@components/UserName'
import directionSelector from '@state/selectors/directionSelector'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import userSelector from '@state/selectors/userSelector'
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import usersSelectorByEventId from '@state/selectors/usersByEventIdSelector'
import cn from 'classnames'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import EventUsersCounterAndAge from '@components/EventUsersCounterAndAge'
import PriceDiscount from '@components/PriceDiscount'
import { useRouter } from 'next/router'

const eventViewFunc = (eventId, clone = false) => {
  const EventSignUpModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
  }) => {
    const modalsFunc = useRecoilValue(modalsFuncAtom)
    const event = useRecoilValue(eventSelector(eventId))
    const direction = useRecoilValue(directionSelector(event.directionId))
    const organizer = useRecoilValue(userSelector(event.organizerId))
    const loggedUser = useRecoilValue(loggedUserAtom)
    // const eventUsers = useRecoilValue(eventsUsersSelectorByEventId(eventId))
    // const eventUsers = useRecoilValue(usersSelectorByEventId(eventId))

    const eventUsers = useRecoilValue(eventsUsersFullByEventIdSelector(eventId))

    const router = useRouter()

    const eventUser = loggedUser?._id
      ? eventUsers.find((eventUser) => eventUser.user._id === loggedUser._id)
      : null

    // const eventUsersCount = eventUsers.length
    // const eventMansCount = eventUsers.filter(
    //   (user) => user.gender === 'male'
    // ).length
    // const eventWomansCount = eventUsers.filter(
    //   (user) => user.gender === 'famale'
    // ).length

    const eventAssistants = eventUsers
      .filter((item) => item.status === 'assistant')
      .map((item) => item.user)
    const eventMansCount = eventUsers.filter(
      (item) =>
        item.user.gender == 'male' &&
        (!item.status || item.status === '' || item.status === 'participant')
    ).length
    const eventWomansCount = eventUsers.filter(
      (item) =>
        item.user.gender == 'famale' &&
        (!item.status || item.status === '' || item.status === 'participant')
    ).length

    const eventParticipantsCount = eventWomansCount + eventMansCount

    // const router = useRouter()

    // const refreshPage = () => {
    //   // setEvent(data)
    //   // router.replace(router.asPath)
    // }

    // const onClickConfirm = async () => {
    //   let error = false
    //   if (!title) {
    //     addError({ title: 'Необходимо ввести название' })
    //     error = true
    //   }
    //   if (!description) {
    //     addError({ description: 'Необходимо ввести описание' })
    //     error = true
    //   }
    //   if (!error) {
    //     closeModal()
    //     if (event && !clone) {
    //       await putData(
    //         `/api/events/${event._id}`,
    //         {
    //           title,
    //           description,
    //           showOnSite,
    //         },
    //         refreshPage
    //       )
    //     } else {
    //       await postData(
    //         `/api/events`,
    //         {
    //           title,
    //           description,
    //           showOnSite,
    //         },
    //         refreshPage
    //       )
    //     }
    //   }
    // }

    // const images = [
    //   {
    //     original: 'https://picsum.photos/id/1018/1000/600/',
    //     // thumbnail: 'https://picsum.photos/id/1018/250/150/',
    //   },
    //   {
    //     original: 'https://picsum.photos/id/1015/1000/600/',
    //     // thumbnail: 'https://picsum.photos/id/1015/250/150/',
    //   },
    //   {
    //     original: 'https://picsum.photos/id/1019/1000/600/',
    //     // thumbnail: 'https://picsum.photos/id/1019/250/150/',
    //   },
    // ]

    const daysFromNow = getDaysFromNow(event.date, false, false)

    const canUserSignUp =
      typeof event.maxUsers !== 'number' ||
      event.maxUsers > eventParticipantsCount
        ? loggedUser?.gender === 'male'
          ? event.maxMans === null || eventMansCount < event.maxMans
          : loggedUser?.gender === 'woman'
          ? event.maxWomans === null || eventWomansCount < event.maxWomans
          : false
        : false

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
            <P className="flex-1">{event.description}</P>
            {direction?.title && (
              <div className="flex gap-x-1">
                <span className="font-bold">Направление:</span>
                <span>{direction.title}</span>
              </div>
            )}
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
          {/* <div className="flex items-center flex-1 px-4">
            <div className="flex pr-2 font-bold leading-5 gap-x-1">
              Участники:
            </div>
            <div className="flex px-2 leading-5 border-r gap-x-1">
              <FontAwesomeIcon
                icon={faMars}
                className="w-5 h-5 text-blue-600"
              />
              <span>{eventMansCount}</span>
              {typeof event.maxMans === 'number' && (
                <>
                  <span>/</span>
                  <span>{event.maxMans}</span>
                </>
              )}
            </div>
            <div className="flex px-2 leading-5 border-r gap-x-1">
              <FontAwesomeIcon
                icon={faVenus}
                className="w-5 h-5 text-red-600"
              />
              <span>{eventWomansCount}</span>
              {typeof event.maxWomans === 'number' && (
                <>
                  <span>/</span>
                  <span>{event.maxWomans}</span>
                </>
              )}
            </div>
            <div className="flex px-2 leading-5 gap-x-1">
              <span className="italic font-bold">Всего:</span>
              <span>{eventParticipantsCount}</span>
              {typeof event.maxUsers === 'number' && (
                <>
                  <span>/</span>
                  <span>{event.maxUsers}</span>
                </>
              )}
            </div>
          </div> */}
          <div className="flex flex-wrap justify-center flex-1 px-4 text-lg font-bold gap-x-1 text-general">
            <div>{formatDateTime(event.date)}</div>
            <div className="font-normal">({getDaysFromNow(event.date)})</div>
          </div>
          <div className="flex flex-col items-center w-full phoneH:justify-between phoneH:flex-row">
            {/* {event.price ? (
              <div className="flex flex-wrap flex-1 px-4 text-lg font-bold gap-x-1 text-general">
                Стоимость мероприятия: {event.price / 100} ₽
              </div>
            ) : (
              <div className="px-4 text-lg font-bold text-general">
                Мероприятие бесплатное
              </div>
            )} */}
            <PriceDiscount event={event} className="px-2" prefix="Стоимость:" />
            {event.status === 'canceled' ? (
              <div className="text-lg font-bold uppercase text-danger">
                Отменено
              </div>
            ) : daysFromNow < 0 && event.status === 'active' ? (
              <div className="text-lg font-bold uppercase text-success">
                Завершено
              </div>
            ) : (
              <Button
                onClick={() => {
                  if (!loggedUser?.gender || !loggedUser?.birthday) {
                    closeModal()
                    router.push('./cabinet/questionnaire')
                  } else if (eventUser) modalsFunc.event.signOut(event._id)
                  else if (canUserSignUp || !loggedUser)
                    modalsFunc.event.signUp(event._id)
                }}
                // className={cn(
                //   'px-4 py-1 text-white duration-300 border-t border-l rounded-tl-lg hover:bg-white',
                //   eventUser
                //     ? 'bg-success hover:text-success border-success'
                //     : 'bg-general hover:text-general border-general'
                // )}
                classBgColor={eventUser ? 'bg-danger' : undefined}
                // classHoverBgColor={eventUser ? 'hover:bg-danger' : undefined}
                className={cn(
                  'w-full px-4 py-1 text-white duration-300 border rounded phoneH:w-auto'
                )}
                name={
                  eventUser
                    ? 'Отменить запись'
                    : canUserSignUp || !loggedUser
                    ? 'Записаться'
                    : loggedUser?.gender && loggedUser?.birthday
                    ? 'Мест нет'
                    : 'Заполните свою анкету'
                }
                disabled={
                  !canUserSignUp && loggedUser?.gender && loggedUser?.birthday
                }
              />
            )}
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
