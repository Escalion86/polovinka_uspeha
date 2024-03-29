import {
  faCheck,
  faGenderless,
  faQuestion,
  faUnlink,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import birthDateToAge from '@helpers/birthDateToAge'
import {
  EVENT_STATUSES_WITH_TIME,
  GENDERS,
  PAY_TYPES,
  SECTORS,
} from '@helpers/constants'
import eventStatusFunc from '@helpers/eventStatus'
import formatDateTime from '@helpers/formatDateTime'
import getUserAvatarSrc from '@helpers/getUserAvatarSrc'
import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import directionSelector from '@state/selectors/directionSelector'
import eventAtom from '@state/async/eventAtom'
import userSelector from '@state/selectors/userSelector'
import cn from 'classnames'
import DOMPurify from 'isomorphic-dompurify'
import { useRecoilValue } from 'recoil'
import DateTimeEvent from './DateTimeEvent'
import EventNameById from './EventNameById'
import TextLinesLimiter from './TextLinesLimiter'
import UserName from './UserName'
import UserNameById from './UserNameById'
import UserStatusIcon from './UserStatusIcon'
import windowDimensionsTailwindSelector from '@state/selectors/windowDimensionsTailwindSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import UserRelationshipIcon from './UserRelationshipIcon'
import serviceSelector from '@state/selectors/serviceSelector'
import IconWithTooltip from './IconWithTooltip'
import paymentSectorFunc from '@helpers/paymentSector'
import PayTypeIcon from './PayTypeIcon'

const ItemContainer = ({
  onClick,
  active,
  children,
  noPadding = false,
  className,
  noBorder = false,
  checkable = true,
  style,
}) => (
  <div
    className={cn(
      'relative flex w-full max-w-full',
      { 'hover:bg-blue-200 cursor-pointer': onClick },
      { 'bg-green-200': active },
      { 'py-0.5 px-1': !noPadding },
      { 'border-b border-gray-700 last:border-0': !noBorder },
      className
    )}
    style={style}
    onClick={
      onClick
        ? (e) => {
            e.stopPropagation()
            onClick()
          }
        : null
    }
  >
    {checkable && (
      <div
        className={cn(
          'transition-all absolute flex items-center top-0 bottom-0 left-0 overflow-hidden duration-300 bg-general',
          active ? 'w-7' : 'w-0'
        )}
      >
        <FontAwesomeIcon icon={faCheck} className="w-6 h-6 ml-0.5 text-white" />
      </div>
    )}
    {children}
  </div>
)

export const UserItemFromId = ({
  userId,
  onClick = null,
  active = false,
  noBorder,
  ...props
}) => {
  const user = useRecoilValue(userSelector(userId))
  return (
    <UserItem
      item={user}
      active={active}
      onClick={onClick}
      noBorder={noBorder}
      {...props}
    />
  )
}

export const UserItem = ({
  item,
  onClick = null,
  active = false,
  noBorder = false,
  style,
  className,
  hideGender,
}) => {
  const serverDate = new Date(useRecoilValue(serverSettingsAtom)?.dateTime)
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)

  const seeBirthday = loggedUserActiveRole?.users?.seeBirthday
  const device = useRecoilValue(windowDimensionsTailwindSelector)

  const userGender =
    item.gender && GENDERS.find((gender) => gender.value === item.gender)

  return (
    <ItemContainer
      onClick={onClick}
      active={active}
      noPadding
      className={cn('flex h-[40px]', className)}
      noBorder={noBorder}
      style={style}
    >
      {!hideGender && (
        <div
          className={cn(
            'w-6 tablet:w-7 min-w-6 tablet:min-w-7 flex justify-center items-center h-full',
            userGender ? 'bg-' + userGender.color : 'bg-gray-400'
          )}
        >
          <FontAwesomeIcon
            className="w-5 h-5 text-white tablet:w-6 tablet:h-6"
            icon={userGender ? userGender.icon : faGenderless}
          />
        </div>
      )}
      <img
        className="object-cover h-10 aspect-1"
        src={getUserAvatarSrc(item)}
        alt="user"
      />
      <div className="flex items-center flex-1 py-0.5 px-1 gap-x-0.5">
        <div className="flex flex-wrap items-center flex-1 max-h-full text-xs text-gray-800 phoneH:text-sm tablet:text-base gap-x-1 gap-y-0.5">
          <UserName user={item} className="font-semibold" thin trunc={2} />
          {item.birthday &&
            (seeBirthday ||
              item.security?.showBirthday === true ||
              item.security?.showBirthday === 'full') && (
              <span className="flex items-center overflow-visible italic leading-3 max-h-2">
                {' (' + birthDateToAge(item.birthday, serverDate) + ')'}
              </span>
            )}
        </div>
        <UserRelationshipIcon
          relationship={item.relationship}
          size={['phoneV', 'phoneH', 'tablet'].includes(device) ? 'm' : 'l'}
          showHavePartnerOnly
        />
        <UserStatusIcon
          status={item.status}
          size={['phoneV', 'phoneH', 'tablet'].includes(device) ? 'm' : 'l'}
        />
      </div>
    </ItemContainer>
  )
}

export const EventItemFromId = ({
  eventId,
  onClick = null,
  active = false,
  bordered = false,
}) => {
  const event = useRecoilValue(eventAtom(eventId))
  return (
    <EventItem
      item={event}
      active={active}
      onClick={onClick}
      bordered={bordered}
    />
  )
}

export const EventItem = ({
  item,
  onClick = null,
  active = false,
  bordered = false,
}) => {
  const direction = useRecoilValue(directionSelector(item.directionId))

  const eventStatus = eventStatusFunc(item)
  const eventStatusObj = EVENT_STATUSES_WITH_TIME.find(
    (data) => data.value === eventStatus
  )

  return (
    <ItemContainer
      onClick={onClick}
      active={active}
      className={cn(
        'flex text-xs tablet:text-sm h-[33px]',
        bordered ? 'border border-gray-500' : ''
      )}
      noPadding
      noBorder={bordered}
    >
      <div
        className={cn(
          'w-7 flex justify-center items-center',
          eventStatusObj ? 'bg-' + eventStatusObj.color : 'bg-gray-400'
        )}
      >
        <FontAwesomeIcon
          className="w-6 h-6 text-white"
          icon={eventStatusObj ? eventStatusObj.icon : faGenderless}
        />
      </div>
      <div className="flex items-center justify-between flex-1 px-1 leading-4">
        <div className="flex flex-col h-full justify-evenly">
          <TextLinesLimiter
            className="font-bold text-general -mb-[1px]"
            textCenter={false}
            lines={1}
          >
            {direction?.title ?? '[Напривление неизвестно]'}
          </TextLinesLimiter>
          <TextLinesLimiter
            className="font-bold text-gray-800"
            lines={1}
            textCenter={false}
          >
            {item.title}
          </TextLinesLimiter>
        </div>
        <div className="text-gray-600 gap-x-2">
          <DateTimeEvent
            wrapperClassName="flex-1 font-bold justify-end"
            dateClassName="text-general"
            timeClassName="italic"
            durationClassName="italic font-normal"
            event={item}
            showDayOfWeek
            thin
            twoLines
          />
        </div>
      </div>
    </ItemContainer>
  )
}

export const DirectionItem = ({ item, onClick = null, active = false }) => (
  <ItemContainer
    onClick={onClick}
    active={active}
    className="flex h-[50px]"
    noPadding
  >
    {item?.image && (
      <img
        className="object-cover h-[50px] aspect-1"
        src={item.image}
        alt="direction"
      />
    )}
    <div className="px-1">
      <div className="h-5 text-sm font-bold text-gray-800 truncate">
        {item.title}
      </div>
      <div className="flex items-center text-xs text-gray-600 gap-x-2">
        <TextLinesLimiter
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(item.description),
          }}
          className="w-full overflow-hidden textarea ql flex-1 max-w-full leading-[0.85rem]"
          lines={2}
          textCenter={false}
        />
      </div>
    </div>
  </ItemContainer>
)

export const ServiceItemFromId = ({
  serviceId,
  onClick = null,
  active = false,
  bordered = false,
}) => {
  const service = useRecoilValue(serviceSelector(serviceId))
  return (
    <ServiceItem
      item={service}
      active={active}
      onClick={onClick}
      bordered={bordered}
    />
  )
}

export const ServiceItem = ({
  item,
  onClick = null,
  active = false,
  className,
  noBorder,
  style,
}) => (
  <ItemContainer
    onClick={onClick}
    active={active}
    className={cn('flex h-[50px]', className)}
    noPadding
    noBorder={noBorder}
    style={style}
  >
    {item?.images && item?.images.length > 0 && (
      <img
        className="object-cover h-[50px] aspect-1"
        src={item.images[0]}
        alt="direction"
      />
    )}
    <div className="px-1">
      <div className="h-5 text-sm font-bold text-gray-800 truncate">
        {item.title}
      </div>
      <div className="flex items-center text-xs text-gray-600 gap-x-2">
        <TextLinesLimiter
          className="w-full overflow-hidden textarea flex-1 max-w-full leading-[0.85rem]"
          lines={2}
          textCenter={false}
        >
          {item.shortDescription}
        </TextLinesLimiter>
      </div>
    </div>
  </ItemContainer>
)

export const PaymentItem = ({
  item,
  onClick = null,
  active = false,
  noBorder = false,
  checkable,
  className,
  showUser = true,
  showEvent = true,
  showSectorIcon = true,
}) => {
  const paymentSector = paymentSectorFunc(item)
  const sectorProps = SECTORS.find((sector) => sector.value === paymentSector)

  return (
    <ItemContainer
      onClick={onClick}
      active={active}
      noPadding
      noBorder={noBorder}
      className={cn('flex h-9', className)}
      checkable={checkable}
    >
      {showSectorIcon && (
        <div
          className={cn(
            'flex items-center justify-center w-8 text-white',
            sectorProps ? 'bg-' + sectorProps.color : 'bg-gray-400'
          )}
        >
          <FontAwesomeIcon
            icon={sectorProps?.icon ?? faQuestion}
            className="w-6 h-6"
          />
        </div>
      )}
      <div className="flex items-center justify-between flex-1 w-full px-1 gap-x-1">
        <div className="flex flex-col">
          <div className="text-sm font-bold leading-4 text-gray-800 truncate">
            {formatDateTime(item.payAt)}
          </div>
          {showUser && (
            <UserNameById
              userId={item.userId}
              noWrap
              className="text-sm font-bold leading-4"
            />
          )}
          {showEvent && (
            <EventNameById
              eventId={item.eventId}
              className="text-sm font-bold leading-4 text-general"
            />
          )}
          {item.comment && (
            <div className="text-sm leading-4">{item.comment}</div>
          )}
        </div>
        <div className="flex justify-end flex-1 gap-x-3">
          {item.sector === 'event' && !item.eventId && (
            <IconWithTooltip
              icon={faUnlink}
              className="text-danger"
              tooltip="Транзакция не привязана к мероприятию"
            />
          )}
          {item.sector === 'service' && !item.serviceId && (
            <IconWithTooltip
              icon={faUnlink}
              className="text-danger"
              tooltip="Транзакция не привязана к услуге"
            />
          )}
          {item.sector === 'product' && !item.productId && (
            <IconWithTooltip
              icon={faUnlink}
              className="text-danger"
              tooltip="Транзакция не привязана к продукту"
            />
          )}
        </div>
        <div className="flex items-center text-xs gap-x-1">
          <div
            className={cn(
              'px-1 text-sm font-bold phoneH:text-base whitespace-nowrap',
              item.payType === 'coupon'
                ? 'text-general'
                : item.payDirection === 'toUser' ||
                    item.payDirection === 'toEvent'
                  ? 'text-danger'
                  : 'text-success'
            )}
          >
            {`${
              item.payDirection === 'toUser' || item.payDirection === 'toEvent'
                ? '-'
                : ''
            }${item.sum / 100} ₽`}
          </div>
          <PayTypeIcon payment={item} size="sm" />
        </div>
      </div>
    </ItemContainer>
  )
}
