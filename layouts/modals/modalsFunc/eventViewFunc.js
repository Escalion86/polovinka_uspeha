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
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import formatAddress from '@helpers/formatAddress'
import formatDateTime from '@helpers/formatDateTime'
import formatMinutes from '@helpers/formatMinutes'
import getEventDuration from '@helpers/getEventDuration'
import isEventClosedFunc from '@helpers/isEventClosed'
import { modalsFuncAtom } from '@state/atoms'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import directionSelector from '@state/selectors/directionSelector'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'
import eventAtom from '@state/async/eventAtom'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import loggedUserToEventStatusSelector from '@state/selectors/loggedUserToEventStatusSelector'
import subEventsSumOfEventSelector from '@state/selectors/subEventsSumOfEventSelector'
import userSelector from '@state/selectors/userSelector'
import DOMPurify from 'isomorphic-dompurify'
import Link from 'next/link'
import { useRouter } from 'next/router'
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
  const event = useRecoilValue(eventAtom(eventId))
  const subEventSum = useRecoilValue(subEventsSumOfEventSelector(event._id))
  const isLoggedUserMember = useRecoilValue(isLoggedUserMemberSelector)
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
  const canEdit = loggedUserActiveRole?.events?.edit
  const seeEventsUsers = loggedUserActiveRole?.eventsUsers?.see
  const isLoggedUserDev = loggedUserActiveRole?.dev

  const direction = useRecoilValue(directionSelector(event?.directionId))
  const organizer = useRecoilValue(userSelector(event?.organizerId))
  const modalsFunc = useRecoilValue(modalsFuncAtom)

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
                data-tip="Открыть адрес в Яндекс Навигаторе"
                href={`yandexnavi://map_search?text=${event.address.town},%20${
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
          <PriceDiscount
            item={subEventSum}
            className="px-2"
            prefix="Стоимость:"
          />
          <EventButtonSignIn eventId={event?._id} noBorders />
        </div>
      </div>
    </div>
  )
}

const EventViewPre = (props) => {
  const { eventId } = props.data
  const event = useRecoilValue(eventAtom(eventId))
  const loggedUserActive = useRecoilValue(loggedUserActiveAtom)
  const { canSee, isAgeOfUserCorrect, isUserStatusCorrect } = useRecoilValue(
    loggedUserToEventStatusSelector(event?._id)
  )

  const router = useRouter()
  const routerQuery = { ...router.query }
  delete routerQuery.id
  const query = event?._id ? { event: event._id } : {}

  return (
    <>
      {event?._id && canSee && <EventViewModal {...props} />}
      <div className="flex flex-col items-center">
        {!event?._id && (
          <span className="text-xl">Ошибка. Мероприятие не найдено</span>
        )}
        {loggedUserActive && !isUserStatusCorrect ? (
          <span className="text-xl">
            {`К сожалению данное мероприятие не доступно для вашего статуса пользователя`}
          </span>
        ) : loggedUserActive && isUserStatusCorrect && !isAgeOfUserCorrect ? (
          <span className="text-xl">
            {`К сожалению данное мероприятие доступно для возрастной категории ${
              loggedUserActive?.gender === 'male'
                ? `мужчин от ${event.minMansAge} до ${event.maxMansAge} лет`
                : `женщин от ${event.minWomansAge} до ${event.maxWomansAge} лет`
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
    </>
  )
}

const eventViewFunc = (eventId) => {
  const data = { eventId }

  return {
    title: `Мероприятие`,
    confirmButtonName: 'Записаться',
    Children: (props) => <EventViewPre {...props} data={data} />,
  }
}

export default eventViewFunc
