import CardButtons from '@components/CardButtons'
import EventTagsChipsLine from '@components/Chips/EventTagsChipsLine'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import Divider from '@components/Divider'
import EventButtonSignIn from '@components/EventButtonSignIn'
import EventUsersCounterAndAge from '@components/EventUsersCounterAndAge'
import ImageGallery from '@components/ImageGallery'
import PriceDiscount from '@components/PriceDiscount'
import TextLine from '@components/TextLine'
import UserName from '@components/UserName'
import ValueItem from '@components/ValuePicker/ValueItem'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import formatAddress from '@helpers/formatAddress'
import formatDateTime from '@helpers/formatDateTime'
import formatMinutes from '@helpers/formatMinutes'
import getEventDuration from '@helpers/getEventDuration'
import isEventClosedFunc from '@helpers/isEventClosed'
import { modalsFuncAtom } from '@state/atoms'
import directionSelector from '@state/selectors/directionSelector'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'
import eventSelector from '@state/selectors/eventSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'
import userSelector from '@state/selectors/userSelector'
import DOMPurify from 'isomorphic-dompurify'
import { Suspense, useEffect } from 'react'
import { useRecoilValue } from 'recoil'

const NamesOfUsersAssistantsOfEventComponent = ({ eventId }) => {
  const users = useRecoilValue(eventAssistantsSelector(eventId))
  return (
    users &&
    users?.length > 0 && (
      <div className="flex leading-5 gap-x-1">
        <span className="font-bold">
          {users?.length > 1 ? 'Ведущие:' : 'Ведущий:'}
        </span>
        <div className="flex flex-wrap items-center gap-x-1 ">
          {users.map((user, index) => {
            if (index < users.length - 1) {
              return (
                <div
                  key={'nameOfUser' + user._id}
                  className="flex items-center flex-nowrap"
                >
                  <UserName user={user} noWrap />
                  <span>,</span>
                </div>
              )
            } else return <UserName key={'nameOfUser' + user._id} user={user} />
          })}
        </div>
      </div>
    )
  )
}

const NamesOfUsersAssistantsOfEvent = (props) => {
  return (
    <Suspense>
      <NamesOfUsersAssistantsOfEventComponent {...props} />
    </Suspense>
  )
}

const eventViewFunc = (eventId) => {
  const EventViewModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const event = useRecoilValue(eventSelector(eventId))
    const isLoggedUserDev = useRecoilValue(isLoggedUserDevSelector)
    const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)
    const isLoggedUserMember = useRecoilValue(isLoggedUserMemberSelector)
    const direction = useRecoilValue(directionSelector(event?.directionId))
    const organizer = useRecoilValue(userSelector(event?.organizerId))
    const modalsFunc = useRecoilValue(modalsFuncAtom)

    const duration = getEventDuration(event)

    const isEventClosed = isEventClosedFunc(event)

    // const eventLoggedUserStatus = useRecoilValue(
    //   loggedUserToEventStatusSelector(eventId)
    // )?.isEventInProcess

    useEffect(() => {
      if (isLoggedUserModer && setTopLeftComponent)
        setTopLeftComponent(() => (
          <CardButtons
            item={event}
            typeOfItem="event"
            forForm
            showEditButton={!isEventClosed}
            showDeleteButton={!isEventClosed}
          />
        ))
    }, [isLoggedUserModer, setTopLeftComponent])

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
          <div className="flex flex-col flex-1 w-full max-w-full px-2 py-2 gap-y-1">
            {event?.tags.length > 0 && (
              <EventTagsChipsLine tags={event?.tags} className="flex-1" />
            )}
            <div className="flex justify-center w-full text-3xl font-bold">
              {event?.title}
            </div>

            {/* <p className="flex-1">{event.description}</p> */}
            <div
              className="w-full max-w-full overflow-hidden list-disc textarea ql"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(event?.description),
              }}
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
            <NamesOfUsersAssistantsOfEvent eventId={eventId} />
          </div>
          <div className="flex flex-col tablet:items-center tablet:flex-row gap-y-1">
            <EventUsersCounterAndAge eventId={eventId} showAges />
            {(isLoggedUserMember || isLoggedUserModer) && (
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
            <PriceDiscount item={event} className="px-2" prefix="Стоимость:" />
            <EventButtonSignIn eventId={event?._id} noBorders />
          </div>
        </div>
      </div>
    )
  }

  return {
    title: `Мероприятие`,
    confirmButtonName: 'Записаться',
    Children: EventViewModal,
    // TopLeftComponent: () => (
    //   <CardButtons
    //     item={{ _id: eventId }}
    //     typeOfItem="event"
    //     forForm
    //   />
    // ),
  }
}

export default eventViewFunc
