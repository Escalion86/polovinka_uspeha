import CardButtons from '@components/CardButtons'
import EventTagsChipsLine from '@components/Chips/EventTagsChipsLine'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import Divider from '@components/Divider'
import EventButtonSignIn from '@components/EventButtonSignIn'
import EventUsersCounterAndAge from '@components/EventUsersCounterAndAge'
import ImageGallery from '@components/ImageGallery'
import PriceDiscount from '@components/PriceDiscount'
import PulseButton from '@components/PulseButton'
import TextLine from '@components/TextLine'
import UserName from '@components/UserName'
import UserRelationshipIcon from '@components/UserRelationshipIcon'
import ValueItem from '@components/ValuePicker/ValueItem'
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers'
import formatAddress from '@helpers/formatAddress'
import formatDateTime from '@helpers/formatDateTime'
import formatMinutes from '@helpers/formatMinutes'
import getEventDuration from '@helpers/getEventDuration'
import isEventClosedFunc from '@helpers/isEventClosed'
import modalsFuncAtom from '@state/atoms/modalsFuncAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import directionSelector from '@state/selectors/directionSelector'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'
import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import loggedUserToEventStatusSelector from '@state/selectors/loggedUserToEventStatusSelector'
import subEventsSumOfEventSelector from '@state/selectors/subEventsSumOfEventSelector'
import userSelector from '@state/selectors/userSelector'
import DOMPurify from 'isomorphic-dompurify'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Suspense, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import eventLoggedUserByEventIdSelector from '@state/selectors/eventLoggedUserByEventIdSelector'

const NamesOfUsersAssistantsOfEventComponent = ({ eventId }) => {
  const users = useAtomValue(eventAssistantsSelector(eventId))

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

const CardButtonsComponent = ({ event, isEventClosed }) => (
  <CardButtons
    item={event}
    typeOfItem="event"
    forForm
    showEditButton={!isEventClosed}
    showDeleteButton={false}
  />
)

const EventViewModal = ({
  data,
  closeModal,
  setOnConfirmFunc,
  setOnDeclineFunc,
  setOnShowOnCloseConfirmDialog,
  setDisableConfirm,
  setDisableDecline,
  setTopLeftComponent,
}) => {
  const { eventId } = data
  const event = useAtomValue(eventFullAtomAsync(eventId))
  const eventUser = useAtomValue(eventLoggedUserByEventIdSelector(eventId))
  const subEventSum = useAtomValue(subEventsSumOfEventSelector(eventId))
  const isLoggedUserMember = useAtomValue(isLoggedUserMemberSelector)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const canEdit = loggedUserActiveRole?.events?.edit
  const seeEventsUsers = loggedUserActiveRole?.eventsUsers?.see
  const isLoggedUserDev = loggedUserActiveRole?.dev

  const direction = useAtomValue(directionSelector(event?.directionId))
  const organizer = useAtomValue(userSelector(event?.organizerId))
  console.log('event?.organizerId :>> ', event?.organizerId)
  console.log('organizer :>> ', organizer)
  const modalsFunc = useAtomValue(modalsFuncAtom)

  const duration = getEventDuration(event)

  const isEventClosed = isEventClosedFunc(event)

  useEffect(() => {
    if (canEdit && setTopLeftComponent) {
      setTopLeftComponent(() => (
        <CardButtonsComponent event={event} isEventClosed={isEventClosed} />
      ))
    }
  }, [canEdit, event, isEventClosed, setTopLeftComponent])

  if (!event || !eventId)
    return (
      <div className="flex justify-center w-full text-lg ">
        ОШИБКА! Мероприятие не найдено!
      </div>
    )

  const subEvent = eventUser?.subEventId
    ? event?.subEvents.find(({ id }) => id === eventUser?.subEventId)
    : undefined

  return (
    <div className="flex flex-col gap-y-2">
      <ImageGallery images={event?.images} />
      <div className="flex flex-col flex-1">
        <div className="flex flex-col flex-1 w-full max-w-full px-2 py-2 gap-y-1">
          <div className="flex items-center w-full gap-x-1">
            {typeof event?.tags === 'object' && event?.tags.length > 0 && (
              <EventTagsChipsLine tags={event?.tags} className="flex-1" />
            )}
            {!setTopLeftComponent && (
              <div className="flex justify-end flex-1">
                <CardButtonsComponent
                  event={event}
                  isEventClosed={isEventClosed}
                  showDeleteButton={false}
                />
              </div>
            )}
          </div>
          {event.usersRelationshipAccess &&
            event.usersRelationshipAccess !== 'yes' && (
              <UserRelationshipIcon
                relationship={event.usersRelationshipAccess === 'only'}
                nameForEvent
                showName
              />
            )}
          <div className="flex justify-center w-full text-3xl font-bold text-center">
            {event?.title}
          </div>
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
          <TextLine label="Начало">{formatDateTime(event?.dateStart)}</TextLine>
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
          {event?.address &&
            (event.address?.link2GisShow || event.address?.linkYandexShow) && (
              <TextLine label="Ссылки для навигатора">
                {event.address?.link2GisShow && (
                  <a
                    data-tip="Открыть адрес в 2ГИС"
                    href={
                      event.address?.link2Gis ||
                      `https://2gis.ru/search/${event.address.town},%20${
                        event.address.street
                      }%20${event.address.house.replaceAll('/', '%2F')}`
                    }
                    target="_blank"
                  >
                    <img
                      className="object-contain w-6 h-6 min-w-6 min-h-6"
                      src="/img/navigators/2gis.png"
                      alt="2gis"
                    />
                  </a>
                )}
                {event.address?.linkYandexShow && (
                  <a
                    data-tip="Открыть адрес в Яндекс Навигаторе"
                    href={
                      event.address?.linkYandexNavigator ||
                      `yandexnavi://map_search?text=${event.address.town},%20${
                        event.address.street
                      }%20${event.address.house.replaceAll('/', '%2F')}`
                    }
                    target="_blank"
                  >
                    <img
                      className="object-contain w-6 h-6 min-w-6 min-h-6"
                      src="/img/navigators/yandex.png"
                      alt="2gis"
                    />
                  </a>
                )}
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
          <EventUsersCounterAndAge event={event} showAges />
          {(isLoggedUserMember || seeEventsUsers) && (
            <ValueItem
              name="Посмотреть участников"
              color="green-500"
              icon={faUsers}
              hoverable
              onClick={() => modalsFunc.event.users(eventId)}
            />
          )}
        </div>
        <Divider thin light />
        <div className="flex flex-col items-center w-full phoneH:justify-between phoneH:flex-row">
          {subEvent ? (
            <>
              {event?.subEvents?.length > 1 && (
                <div>
                  Вариант записи на мероприятие:{' '}
                  <strong>{subEvent.title}</strong>
                </div>
              )}
              <div className="flex gap-x-1">
                <div>Стоимость:</div>
                <PriceDiscount item={subEvent} />
              </div>
            </>
          ) : (
            <PriceDiscount
              item={subEventSum}
              className="px-2"
              prefix="Стоимость:"
            />
          )}
          <EventButtonSignIn eventId={event?._id} noBorders />
        </div>
      </div>
    </div>
  )
}

const EventView = (props) => {
  const { eventId } = props.data
  const event = useAtomValue(eventFullAtomAsync(eventId))

  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const { canSee, isAgeOfUserCorrect, isUserStatusCorrect, status } =
    useAtomValue(loggedUserToEventStatusSelector(event?._id))

  const subEventSum = useAtomValue(subEventsSumOfEventSelector(event._id))

  const router = useRouter()
  const routerQuery = { ...router.query }
  delete routerQuery.id
  const query = event?._id ? { event: event._id } : {}

  if (!event?._id)
    return <div className="text-xl">Ошибка. Мероприятие не найдено</div>

  return event?._id && canSee ? (
    <EventViewModal {...props} />
  ) : (
    <div className="flex flex-col items-center">
      {loggedUserActive && !isUserStatusCorrect ? (
        <span className="text-xl">
          {`К сожалению данное мероприятие не доступно для вашего статуса пользователя`}
        </span>
      ) : loggedUserActive && isUserStatusCorrect && !isAgeOfUserCorrect ? (
        <span className="text-xl">
          {`К сожалению данное мероприятие доступно для возрастной категории ${
            loggedUserActive?.gender === 'male'
              ? `мужчин от ${subEventSum.minMansAge} до ${subEventSum.maxMansAge} лет`
              : `женщин от ${subEventSum.minWomansAge} до ${subEventSum.maxWomansAge} лет`
          }`}
        </span>
      ) : !canSee && isUserStatusCorrect && isAgeOfUserCorrect ? (
        <span className="text-xl">
          Мероприятие скрыто, если вы не ошиблись со ссылкой, то пожалуйста
          обратитесь к администратору
        </span>
      ) : (
        !loggedUserActive && (
          <>
            <span className="text-xl">
              Мероприятие не доступно для просмотра неавторизированным
              пользователям, пожалуйста авторизируйтесь
            </span>
            <Link
              prefetch={false}
              className="max-w-[76%]"
              href={{
                pathname: '/login',
                query: { ...routerQuery, ...query },
              }}
              shallow
            >
              <PulseButton
                className="mt-4 text-white"
                title="Авторизироваться"
                // onClick={() => router.push('./login', '', { shallow: true })}
              />
            </Link>
            <Link
              prefetch={false}
              className="max-w-[76%]"
              href={{
                pathname: '/login',
                query: {
                  ...routerQuery,
                  ...query,
                  registration: true,
                },
              }}
              shallow
            >
              <PulseButton
                className="mt-4 text-white"
                title="Зарегистрироваться"
                // onClick={() => router.push('./login', '', { shallow: true })}
              />
            </Link>
          </>
        )
      )}
    </div>
  )
}

const eventViewFunc = (eventId) => {
  const data = { eventId }

  return {
    title: `Мероприятие`,
    confirmButtonName: 'Записаться',
    Children: (props) => <EventView {...props} data={data} />,
  }
}

export default eventViewFunc
