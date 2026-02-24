import EventCardButtons from '@components/cardButtons/EventCardButtons'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import Divider from '@components/Divider'
import EventButtonSignIn from '@components/EventButtonSignIn'
import EventUsersCounterAndAge from '@components/EventUsersCounterAndAge'
import ImagesMarquee from '@components/ImagesMarquee'
import PriceDiscount from '@components/PriceDiscount'
import PulseButton from '@components/PulseButton'
import TextLine from '@components/TextLine'
import UserName from '@components/UserName'
import UserRelationshipIcon from '@components/UserRelationshipIcon'
import ValueItem from '@components/ValuePicker/ValueItem'
import NoOrphanText from '@components/NoOrphanText'
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers'
import formatAddress from '@helpers/formatAddress'
import formatDateTime from '@helpers/formatDateTime'
import formatMinutes from '@helpers/formatMinutes'
import getEventDuration from '@helpers/getEventDuration'
import isEventClosedFunc from '@helpers/isEventClosed'
import { LOCATIONS } from '@helpers/constants'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import locationAtom from '@state/atoms/locationAtom'
import directionSelector from '@state/selectors/directionSelector'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'
import eventSelector from '@state/selectors/eventSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import loggedUserToEventStatusSelector from '@state/selectors/loggedUserToEventStatusSelector'
import subEventsSumOfEventSelector from '@state/selectors/subEventsSumOfEventSelector'
import userSelector from '@state/selectors/userSelector'
import DOMPurify from 'isomorphic-dompurify'
import Link from 'next/link'
import useRouter from '@utils/useRouter'
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
  <EventCardButtons
    item={event}
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
  const event = useAtomValue(eventSelector(eventId))
  const eventUser = useAtomValue(eventLoggedUserByEventIdSelector(eventId))
  const subEventSum = useAtomValue(subEventsSumOfEventSelector(eventId))
  const isLoggedUserMember = useAtomValue(isLoggedUserMemberSelector)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const canEdit = loggedUserActiveRole?.events?.edit
  const seeEventsUsers = loggedUserActiveRole?.eventsUsers?.see
  const isLoggedUserDev = loggedUserActiveRole?.dev
  const location = useAtomValue(locationAtom)

  const direction = useAtomValue(directionSelector(event?.directionId))
  const organizer = useAtomValue(userSelector(event?.organizerId))
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
    <div className="flex flex-col gap-4 pb-2">
      <ImagesMarquee
        images={event?.images}
        className="rounded-2xl border border-[#ead7de] shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
        imageClassName="brightness-[0.9]"
        heightClassName="h-56"
        itemWidthClassName="w-80"
      />
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-[#ead7de] bg-[linear-gradient(135deg,#fff,#f9f2f5)] p-4 shadow-[0_8px_24px_rgba(107,31,42,0.08)]">
          <div className="flex items-start gap-2">
            {!setTopLeftComponent && (
              <div className="ml-auto">
                <CardButtonsComponent event={event} isEventClosed={isEventClosed} />
              </div>
            )}
          </div>

          {event.usersRelationshipAccess &&
            event.usersRelationshipAccess !== 'yes' && (
              <div className="mb-2">
                <UserRelationshipIcon
                  relationship={event.usersRelationshipAccess === 'only'}
                  nameForEvent
                  showName
                />
              </div>
            )}

          <h2 className="text-center text-[clamp(24px,4vw,34px)] font-bold leading-tight text-[#4b0f1c] whitespace-pre-line">
            {event?.title}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#f0e2e8] bg-white p-4 shadow-[0_6px_16px_rgba(0,0,0,0.05)]">
          <NoOrphanText
            as="div"
            className="w-full max-w-full overflow-hidden list-disc textarea ql text-[15px] leading-relaxed text-[#2e2530]"
            html={DOMPurify.sanitize(event?.description)}
          />
        </div>

        <div className="rounded-2xl border border-[#f0e2e8] bg-white p-4 shadow-[0_6px_16px_rgba(0,0,0,0.05)]">
          <div className="grid gap-2">
            {isLoggedUserDev && <TextLine label="ID">{event?._id}</TextLine>}
            {direction?.title && (
              <TextLine label="Пространство">{direction.title}</TextLine>
            )}
            <TextLine label="Начало">{formatDateTime(event?.dateStart)}</TextLine>
            <TextLine label="Завершение">{formatDateTime(event?.dateEnd)}</TextLine>
            <TextLine label="Продолжительность">
              {formatMinutes(duration ?? 60)}
            </TextLine>

            {event?.address && (
              <TextLine label="Адрес">
                {formatAddress(
                  event?.address,
                  '[не указан]',
                  LOCATIONS?.[location]?.townRu
                )}
              </TextLine>
            )}
            {event?.address &&
              (event.address?.link2GisShow || event.address?.linkYandexShow) && (
                <TextLine label="Навигатор">
                  <div className="flex items-center gap-2">
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
                        className="rounded-lg border border-[#f0e2e8] p-1 transition hover:bg-[#f7f1f4]"
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
                        className="rounded-lg border border-[#f0e2e8] p-1 transition hover:bg-[#f7f1f4]"
                      >
                        <img
                          className="object-contain w-6 h-6 min-w-6 min-h-6"
                          src="/img/navigators/yandex.png"
                          alt="2gis"
                        />
                      </a>
                    )}
                  </div>
                </TextLine>
              )}

            {event?.organizerId && (
              <>
                <TextLine label="Организатор">
                  <UserName user={organizer} noWrap />
                </TextLine>
                <TextLine label="Контакты">
                  <ContactsIconsButtons user={organizer} />
                </TextLine>
              </>
            )}

            <NamesOfUsersAssistantsOfEvent eventId={eventId} />
          </div>
        </div>

        <div className="rounded-2xl border border-[#f0e2e8] bg-white p-3 shadow-[0_6px_16px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col tablet:items-center tablet:flex-row gap-y-2">
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
        </div>

        <div className="rounded-2xl border border-[#ead7de] bg-[linear-gradient(135deg,#fff,#f9f2f5)] p-4 shadow-[0_10px_24px_rgba(107,31,42,0.08)]">
          <div className="flex flex-col items-center gap-3 phoneH:flex-row phoneH:justify-between">
            <div className="flex flex-col items-center phoneH:items-start">
              {subEvent ? (
                <>
                  {event?.subEvents?.length > 1 && (
                    <div className="text-sm text-[#5a4750]">
                      Вариант записи: <strong>{subEvent.title}</strong>
                    </div>
                  )}
                  <div className="inline-flex rounded-full bg-[#f7f1f4] px-3 py-1">
                    <PriceDiscount
                      item={subEvent}
                      className="font-futura font-semibold text-[18px] text-[#6b1f2a]"
                    />
                  </div>
                </>
              ) : (
                <div className="inline-flex rounded-full bg-[#f7f1f4] px-3 py-1">
                  <PriceDiscount
                    item={subEventSum}
                    className="font-futura font-semibold text-[18px] text-[#6b1f2a]"
                  />
                </div>
              )}
            </div>
            <EventButtonSignIn eventId={event?._id} noBorders />
          </div>
        </div>
      </div>
    </div>
  )
}

const EventView = (props) => {
  const { eventId } = props.data
  const event = useAtomValue(eventSelector(eventId))

  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const { canSee, isAgeOfUserCorrect, isUserStatusCorrect } =
    useAtomValue(loggedUserToEventStatusSelector(event?._id)) ?? {}

  const subEventSum =
    useAtomValue(subEventsSumOfEventSelector(event?._id)) ?? {}

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
      {loggedUserActive && isUserStatusCorrect === false ? (
        <span className="text-xl">
          {`К сожалению данное мероприятие не доступно для вашего статуса пользователя`}
        </span>
      ) : loggedUserActive &&
        isUserStatusCorrect !== false &&
        isAgeOfUserCorrect === false ? (
        <span className="text-xl">
          {`К сожалению данное мероприятие доступно для возрастной категории ${
            loggedUserActive?.gender === 'male'
              ? `мужчин от ${subEventSum.minMansAge} до ${subEventSum.maxMansAge} лет`
              : `женщин от ${subEventSum.minWomansAge} до ${subEventSum.maxWomansAge} лет`
          }`}
        </span>
      ) : canSee === false &&
        isUserStatusCorrect !== false &&
        isAgeOfUserCorrect !== false ? (
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

