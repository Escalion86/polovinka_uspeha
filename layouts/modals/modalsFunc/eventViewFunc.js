import React from 'react'

import { useRecoilValue } from 'recoil'
import eventSelector from '@state/selectors/eventSelector'

import formatAddress from '@helpers/formatAddress'
import formatDateTime from '@helpers/formatDateTime'
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
import sanitize from '@helpers/sanitize'
// import CardButton from '@components/CardButton'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
// import Button from '@components/Button'
import { modalsFuncAtom } from '@state/atoms'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
// import loggedUserToEventStatusSelector from '@state/selectors/loggedUserToEventStatusSelector'
import NamesOfUsers from '@components/NamesOfUsers'
// import useCopyEventLinkToClipboard from '@helpers/useCopyEventLinkToClipboard'
import ImageGallery from '@components/ImageGallery'
import CardButtons from '@components/CardButtons'
import ValueItem from '@components/ValuePicker/ValueItem'
import TextLine from '@components/TextLine'
import getEventDuration from '@helpers/getEventDuration'

const eventViewFunc = (eventId) => {
  const EventSignUpModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const event = useRecoilValue(eventSelector(eventId))
    const isLoggedUserDev = useRecoilValue(isLoggedUserDevSelector)
    const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
    const isLoggedUserMember = useRecoilValue(isLoggedUserMemberSelector)
    const direction = useRecoilValue(directionSelector(event?.directionId))
    const organizer = useRecoilValue(userSelector(event?.organizerId))
    const modalsFunc = useRecoilValue(modalsFuncAtom)

    const eventAssistants = useRecoilValue(eventAssistantsSelector(eventId))

    const duration = getEventDuration(event)

    // const eventLoggedUserStatus = useRecoilValue(
    //   loggedUserToEventStatusSelector(eventId)
    // )?.isEventInProcess

    if (!event || !eventId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Мероприятие не найдено!
        </div>
      )

    // const finishedDateTime =
    //   new Date(event?.date).getTime() + (event?.duration ?? 0) * 60000

    return (
      <div className="flex flex-col gap-y-2">
        <ImageGallery images={event?.images} />
        <div className="flex flex-col flex-1">
          <div className="flex flex-col flex-1 px-2 py-2">
            <div className="flex justify-center w-full text-3xl font-bold">
              {event?.title}
            </div>

            {/* <p className="flex-1">{event.description}</p> */}
            <div
              className="flex-1 textarea"
              dangerouslySetInnerHTML={{ __html: sanitize(event?.description) }}
            />
            <Divider thin light />
            {isLoggedUserDev && <TextLine label="ID">{event?._id}</TextLine>}
            {direction?.title && (
              <TextLine label="Направление">{direction.title}</TextLine>
            )}
            <TextLine label="Начало">
              {formatDateTime(event?.dateStart)}
            </TextLine>
            <TextLine label="Завершение">
              {formatDateTime(event?.dateEnd)}
            </TextLine>
            <TextLine label="Продолжительность">
              {formatMinutes(duration ?? 60)}
            </TextLine>

            {event?.address && (
              <TextLine label="Адрес">
                {formatAddress(event?.address, '[не указан]')}
              </TextLine>
            )}
            {event?.address && event.address?.town && event.address?.street && (
              <TextLine label="Ссылки для навигатора">
                <a
                  data-tip="Открыть адрес в 2ГИС"
                  href={`https://2gis.ru/search/${event.address.town},%20${
                    event.address.street
                  }%20${event.address.house.replaceAll('/', '%2F')}`}
                >
                  <img
                    className="object-contain w-6 h-6 min-w-6 min-h-6"
                    src="/img/navigators/2gis.png"
                    alt="2gis"
                  />
                </a>
                <a
                  // className="laptop:hidden"
                  data-tip="Открыть адрес в Яндекс Навигаторе"
                  href={`yandexnavi://map_search?text=${
                    event.address.town
                  },%20${
                    event.address.street
                  }%20${event.address.house.replaceAll('/', '%2F')}`}
                >
                  <img
                    className="object-contain w-6 h-6 min-w-6 min-h-6"
                    src="/img/navigators/yandex.png"
                    alt="2gis"
                  />
                </a>
              </TextLine>
            )}
            {event?.organizerId && (
              <>
                <TextLine label="Организатор">
                  <UserName user={organizer} noWrap />
                </TextLine>
                <TextLine label="Контакты организатора">
                  <ContactsIconsButtons user={organizer} />
                </TextLine>
              </>
            )}
            <NamesOfUsers
              users={eventAssistants}
              title={eventAssistants.length > 1 ? 'Ведущие:' : 'Ведущий:'}
            />
          </div>
          <div className="flex flex-col tablet:items-center tablet:flex-row gap-y-1">
            <EventUsersCounterAndAge eventId={eventId} />
            {(isLoggedUserMember || isLoggedUserAdmin) && (
              // <Button
              //   name="Посмотреть участников"
              //   onClick={() => modalsFunc.event.users(eventId)}
              // />
              <ValueItem
                name="Посмотреть участников"
                color="green-500"
                icon={faUsers}
                hoverable
                onClick={() => modalsFunc.event.users(eventId)}
              />
            )}
          </div>
          {/* <Divider thin light /> */}

          {/* <div className="flex flex-wrap justify-center flex-1 px-4 text-lg font-bold gap-x-1 text-general">
            <div>{formatDateTime(event.date)}</div>
            <div className="font-normal">({getDaysFromNow(event.date)})</div>
          </div> */}
          <Divider thin light />
          <div className="flex flex-col items-center w-full phoneH:justify-between phoneH:flex-row">
            <PriceDiscount event={event} className="px-2" prefix="Стоимость:" />
            <EventButtonSignIn eventId={event?._id} />
          </div>
        </div>
      </div>
    )
  }

  return {
    title: `Мероприятие`,
    confirmButtonName: 'Записаться',
    Children: EventSignUpModal,
    TopLeftComponent: () => (
      <CardButtons
        item={{ _id: eventId }}
        typeOfItem="event"
        forForm
        direction="right"
      />
    ),
  }
}

export default eventViewFunc
