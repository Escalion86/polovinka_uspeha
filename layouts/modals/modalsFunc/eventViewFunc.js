import EventCardButtons from '@components/cardButtons/EventCardButtons'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import DateTimeEvent from '@components/DateTimeEvent'
import EventFreePlacesBadge from '@components/EventFreePlacesBadge'
import ImagesMarquee from '@components/ImagesMarquee'
import ModalPillPanel from '@components/ModalPillPanel'
import ModalSurface from '@components/ModalSurface'
import ModalSectionTitle from '@components/ModalSectionTitle'
import NavigatorLinkButton from '@components/NavigatorLinkButton'
import PriceDiscount from '@components/PriceDiscount'
import PulseButton from '@components/PulseButton'
import TextLine from '@components/TextLine'
import UserName from '@components/UserName'
import UserRelationshipIcon from '@components/UserRelationshipIcon'
import ValueItem from '@components/ValuePicker/ValueItem'
import NoOrphanText from '@components/NoOrphanText'
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers'
import formatAddress from '@helpers/formatAddress'
// import formatDateTime from '@helpers/formatDateTime'
// import formatMinutes from '@helpers/formatMinutes'
// import getEventDuration from '@helpers/getEventDuration'
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
import Skeleton from 'react-loading-skeleton'
import useRouter from '@utils/useRouter'
import { Suspense, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import eventLoggedUserByEventIdSelector from '@state/selectors/eventLoggedUserByEventIdSelector'

const NamesOfUsersAssistantsOfEventComponent = ({ eventId }) => {
  const usersRaw = useAtomValue(eventAssistantsSelector(eventId))
  const users = Array.isArray(usersRaw)
    ? usersRaw.filter((user) => user && user._id)
    : []

  return (
    users.length > 0 && (
      <div className="flex flex-col mt-2 leading-5 gap-x-1">
        <ModalSectionTitle>
          {users.length > 1 ? 'Ведущие' : 'Ведущий'}
        </ModalSectionTitle>
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

const EventOrganizersAndAssistantsSkeleton = () => (
  <ModalSurface>
    <Skeleton height={14} width={170} />
    <div className="mt-3">
      <Skeleton height={20} width={220} />
    </div>
    <div className="mt-2">
      <Skeleton height={18} width={200} />
    </div>
    <div className="mt-3">
      <Skeleton height={16} width={140} />
    </div>
  </ModalSurface>
)

const EventOrganizersAndAssistantsBlockComponent = ({ event, eventId }) => {
  const organizer = useAtomValue(userSelector(event?.organizerId))
  const assistantsRaw = useAtomValue(eventAssistantsSelector(eventId))
  const assistants = Array.isArray(assistantsRaw)
    ? assistantsRaw.filter((user) => user && user._id)
    : []
  const isSingleAssistantOrganizer =
    assistants.length === 1 &&
    organizer?._id &&
    String(assistants[0]?._id) === String(organizer?._id)

  if (!event?.organizerId) return null

  return (
    <ModalSurface>
      <ModalSectionTitle>
        {isSingleAssistantOrganizer ? 'Ведущий и организатор' : 'Организатор'}
      </ModalSectionTitle>
      <UserName user={organizer} noWrap />
      <div className="mt-1">
        <TextLine label="Контакты организатора">
          <ContactsIconsButtons user={organizer} gapX={4} className="ml-1" />
        </TextLine>
      </div>
      {!isSingleAssistantOrganizer ? (
        <NamesOfUsersAssistantsOfEvent eventId={eventId} />
      ) : null}
    </ModalSurface>
  )
}

const EventOrganizersAndAssistantsBlock = (props) => (
  <Suspense fallback={<EventOrganizersAndAssistantsSkeleton />}>
    <EventOrganizersAndAssistantsBlockComponent {...props} />
  </Suspense>
)

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
  setTopLeftComponent,
  setBottomLeftComponent,
  setConfirmButtonName,
  setDeclineButtonShow,
}) => {
  const { eventId } = data
  const event = useAtomValue(eventSelector(eventId))
  const eventUser = useAtomValue(eventLoggedUserByEventIdSelector(eventId))
  const subEventSum = useAtomValue(subEventsSumOfEventSelector(eventId))
  const isLoggedUserMember = useAtomValue(isLoggedUserMemberSelector)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const canEdit = loggedUserActiveRole?.events?.edit
  // const isLoggedUserDev = loggedUserActiveRole?.dev
  const location = useAtomValue(locationAtom)

  const direction = useAtomValue(directionSelector(event?.directionId))
  const loggedUserEventStatus = useAtomValue(
    loggedUserToEventStatusSelector(eventId)
  )
  const modalsFunc = useAtomValue(modalsFuncAtom)

  // const duration = getEventDuration(event)

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

  useEffect(() => {
    if (!event) return undefined

    const activeStatus = eventUser?.status
    const isAlreadySignedUp = ['participant', 'reserve'].includes(activeStatus)
    const canSignInReserveOnly =
      !isAlreadySignedUp &&
      loggedUserEventStatus?.canSignIn === false &&
      loggedUserEventStatus?.canSignInReserve === true

    setConfirmButtonName(
      isAlreadySignedUp
        ? activeStatus === 'reserve'
          ? 'Отписаться из резерва'
          : 'Отписаться'
        : canSignInReserveOnly
          ? 'Записаться в резерв'
          : 'Записаться'
    )
    setOnConfirmFunc(() => () => {
      if (isAlreadySignedUp) {
        modalsFunc.event.signOut(event, activeStatus)
      } else if (canSignInReserveOnly) {
        modalsFunc.event.signUp(event, 'reserve')
      } else {
        modalsFunc.event.signUp(event)
      }
    })
    setBottomLeftComponent(
      <div className="inline-flex rounded-full bg-[#f7f1f4] px-3 py-1">
        <PriceDiscount
          item={subEvent || subEventSum}
          className="font-futura font-semibold text-[18px] text-[#6b1f2a]"
        />
      </div>
    )

    return () => {
      setOnConfirmFunc(undefined)
      setBottomLeftComponent(undefined)
      setConfirmButtonName('Записаться')
      // setDeclineButtonShow(true)
      // setConfirmButtonName('Подтвердить')
    }
  }, [
    event,
    eventUser?.status,
    loggedUserEventStatus?.canSignIn,
    loggedUserEventStatus?.canSignInReserve,
    modalsFunc,
    setBottomLeftComponent,
    setConfirmButtonName,
    setDeclineButtonShow,
    setOnConfirmFunc,
    subEvent,
    subEventSum,
  ])

  return (
    <div className="flex flex-col gap-4 pb-2">
      <ImagesMarquee
        images={event?.images}
        className="rounded-2xl border border-[#ead7de] shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
        imageClassName="brightness-[0.9]"
        heightClassName="h-56 phoneH:h-70"
      />
      <div className="flex flex-col gap-3">
        <ModalSurface
          tone="accent"
          className="relative overflow-hidden"
          paddingClassName="px-4 pb-4 pt-8"
        >
          <div className="flex items-start gap-2">
            {!setTopLeftComponent && (
              <div className="ml-auto">
                <CardButtonsComponent
                  event={event}
                  isEventClosed={isEventClosed}
                />
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
          <div className="absolute -top-[2px] left-0">
            {direction?.title ? (
              <span className="bg-[#6b1f2a0e] inline-flex items-center rounded-br-lg border-b border-r border-[rgba(107,31,42,0.2)] px-3 py-1 text-xs font-semibold tracking-[0.08em] uppercase text-[#6b1f2a]">
                {direction.title}
              </span>
            ) : null}
          </div>
          <div className="flex justify-center mt-3">
            <DateTimeEvent
              event={event}
              wrapperClassName="text-base laptop:text-lg font-bold leading-4 laptop:leading-5"
              dateClassName="text-general"
              timeClassName="italic"
              durationClassName="italic text-base font-normal"
              showDayOfWeek
              fullMonth
              showDuration
              twoLines={false}
            />
          </div>
        </ModalSurface>

        <ModalSurface>
          <NoOrphanText
            as="div"
            className="w-full max-w-full overflow-hidden list-disc textarea ql text-[15px] leading-relaxed text-[#2e2530]"
            html={DOMPurify.sanitize(event?.description)}
          />
        </ModalSurface>
        {event?.address ? (
          <ModalSurface>
            <ModalSectionTitle>Адрес и навигатор</ModalSectionTitle>
            <TextLine label="Адрес">
              {formatAddress(
                event?.address,
                '[не указан]',
                LOCATIONS?.[location]?.townRu
              )}
            </TextLine>
            {event.address?.link2GisShow || event.address?.linkYandexShow ? (
              <div className="flex items-center gap-2 mt-3">
                {event.address?.link2GisShow && (
                  <NavigatorLinkButton
                    href={
                      event.address?.link2Gis ||
                      `https://2gis.ru/search/${event.address.town},%20${
                        event.address.street
                      }%20${event.address.house.replaceAll('/', '%2F')}`
                    }
                    title="Открыть адрес в 2ГИС"
                    imgSrc="/img/navigators/2gis.png"
                    imgAlt="2gis"
                  >
                    2ГИС
                  </NavigatorLinkButton>
                )}
                {event.address?.linkYandexShow && (
                  <NavigatorLinkButton
                    href={
                      event.address?.linkYandexNavigator ||
                      `yandexnavi://map_search?text=${event.address.town},%20${
                        event.address.street
                      }%20${event.address.house.replaceAll('/', '%2F')}`
                    }
                    title="Открыть адрес в Яндекс Навигаторе"
                    imgSrc="/img/navigators/yandex.png"
                    imgAlt="Яндекс Навигатор"
                  >
                    Яндекс Навигатор
                  </NavigatorLinkButton>
                )}
              </div>
            ) : null}
          </ModalSurface>
        ) : null}

        <EventOrganizersAndAssistantsBlock event={event} eventId={eventId} />

        <ModalSurface paddingClassName="p-3">
          <ModalPillPanel>
            <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
              <Suspense
                fallback={
                  <div className="inline-flex items-center rounded-full bg-[#4fb0e8]/15 px-3 py-1 text-sm font-semibold text-[#1f6e9c]">
                    ...
                  </div>
                }
              >
                <EventFreePlacesBadge event={event} />
              </Suspense>
              {isLoggedUserMember ? (
                <ValueItem
                  name="Посмотреть участников"
                  color="green-500"
                  icon={faUsers}
                  hoverable
                  onClick={() => modalsFunc.event.users(eventId)}
                />
              ) : null}
            </div>
          </ModalPillPanel>
        </ModalSurface>
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
    declineButtonName: 'Закрыть',
    Children: (props) => <EventView {...props} data={data} />,
  }
}

export default eventViewFunc
