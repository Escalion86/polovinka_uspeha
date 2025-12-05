import { useAtomValue } from 'jotai'

import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark'
import { faGenderless } from '@fortawesome/free-solid-svg-icons/faGenderless'
import { faGift } from '@fortawesome/free-solid-svg-icons/faGift'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { faUnlink } from '@fortawesome/free-solid-svg-icons/faUnlink'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus'
import { faUserTie } from '@fortawesome/free-solid-svg-icons/faUserTie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import birthDateToAge from '@helpers/birthDateToAge'
import { EVENT_STATUSES_WITH_TIME, GENDERS, SECTORS } from '@helpers/constants'
import eventStatusFunc from '@helpers/eventStatus'
import formatDateTime from '@helpers/formatDateTime'
import getUserAvatarSrc from '@helpers/getUserAvatarSrc'
import isUserAdmin from '@helpers/isUserAdmin'
import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'
import directionSelector from '@state/selectors/directionSelector'
import userSelector from '@state/selectors/userSelector'
import cn from 'classnames'
import DOMPurify from 'isomorphic-dompurify'
import DateTimeEvent from './DateTimeEvent'
import { EventNameById } from './EventName'
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
import eventSelector from '@state/selectors/eventSelector'
import { Suspense } from 'react'
import UserItemSkeleton from '@layouts/cards/Skeletons/UserItemSkeleton'
import ItemContainer from './ItemContainer'

export const UserItemFromId = (props) => {
  return (
    <Suspense fallback={<UserItemSkeleton {...props} />}>
      <UserItemFromIdComponent {...props} />
    </Suspense>
  )
}

const UserItemFromIdComponent = ({
  userId,
  onClick = null,
  active,
  noBorder,
  ...props
}) => {
  const user = useAtomValue(userSelector(userId))
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
  active,
  noBorder = false,
  style,
  className,
  hideGender,
  children,
  nameFieldWrapperClassName,
  showConsentIcon = false,
}) => {
  const serverDate = new Date(useAtomValue(serverSettingsAtom)?.dateTime)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const loggedUserActiveRoleName = useAtomValue(loggedUserActiveRoleNameAtom)

  if (!item) return null

  const seeBirthday =
    item.birthday &&
    (loggedUserActiveRole?.users?.seeBirthday ||
      item.security?.showBirthday === true ||
      item.security?.showBirthday === 'full')

  const device = useAtomValue(windowDimensionsTailwindSelector)

  const userGender =
    item.gender && GENDERS.find((gender) => gender.value === item.gender)

  const canSeeConsentIcon =
    showConsentIcon &&
    (loggedUserActiveRole?.dev ||
      isUserAdmin(loggedUserActiveRoleName) ||
      loggedUserActiveRoleName === 'moderator')

  return (
    <ItemContainer
      onClick={onClick}
      active={active}
      noPadding
      className={cn('flex h-[42px]', className)}
      noBorder={noBorder}
      style={style}
    >
      {!hideGender && (
        <div
          className={cn(
            'w-6 tablet:w-7 min-w-6 tablet:min-w-7 flex flex-col gap-y-1 justify-center items-center h-full',
            userGender ? 'bg-' + userGender.color : 'bg-gray-400'
          )}
        >
          <FontAwesomeIcon
            className="w-[18px] h-[18px] text-white"
            icon={userGender ? userGender.icon : faGenderless}
          />
          {seeBirthday && (
            <span className="text-sm leading-3 text-white whitespace-nowrap">
              {birthDateToAge(item.birthday, serverDate, false, false, true)}
            </span>
          )}
        </div>
      )}
      <img
        className="object-cover h-[42px] aspect-1"
        src={getUserAvatarSrc(item)}
        alt="user"
      />
      <div className="relative flex-1 flex items-center py-0.5 px-1 gap-x-0.5">
        <div className="flex items-center flex-1 max-h-full">
          <div
            className={cn(
              'flex flex-col flex-1 max-h-full text-xs text-gray-800 phoneH:text-sm tablet:text-base gap-x-1',
              nameFieldWrapperClassName
            )}
          >
            <UserName
              user={item}
              className="flex-1 font-bold min-h-7"
              thin
              trunc={2}
              children={
                <>
                  {hideGender && seeBirthday && (
                    <span className="font-normal whitespace-nowrap">
                      {` (${birthDateToAge(item.birthday, serverDate)})`}
                    </span>
                  )}
                </>
              }
            />
          </div>
          <UserRelationshipIcon
            relationship={item.relationship}
            size={['phoneV', 'phoneH', 'tablet'].includes(device) ? 'm' : 'l'}
            showHavePartnerOnly
          />
          {canSeeConsentIcon && (
            <FontAwesomeIcon
              icon={item.consentToMailing ? faCircleCheck : faCircleXmark}
              className={cn(
                'w-4 h-4 mx-1',
                item.consentToMailing ? 'text-green-600' : 'text-red-700'
              )}
              title={
                item.consentToMailing
                  ? 'Пользователь дал согласие на рассылку'
                  : 'Пользователь не дал согласие на рассылку'
              }
            />
          )}
          <UserStatusIcon
            status={item.status}
            size={['phoneV', 'phoneH', 'tablet'].includes(device) ? 'm' : 'l'}
          />
        </div>
        {children && children(item)}
      </div>
    </ItemContainer>
  )
}

export const EventItemFromId = ({ eventId, ...props }) => {
  const event = useAtomValue(eventSelector(eventId))
  return <EventItem item={event} {...props} />
}

export const EventItem = ({
  item,
  onClick = null,
  active,
  bordered = false,
  className,
  classNameHeight = 'h-[33px]',
  noBorder,
  noStatusIcon,
}) => {
  const direction = useAtomValue(directionSelector(item.directionId))

  const eventStatus = eventStatusFunc(item)
  const eventStatusObj = EVENT_STATUSES_WITH_TIME.find(
    (data) => data.value === eventStatus
  )

  return (
    <ItemContainer
      onClick={onClick}
      active={active}
      className={cn(
        'flex text-xs tablet:text-sm',
        classNameHeight,
        bordered ? 'border border-gray-500' : '',
        className
      )}
      noPadding
      noBorder={noBorder || bordered}
    >
      {!noStatusIcon && (
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
      )}
      <div className="flex items-center justify-between flex-1 px-1 leading-4">
        <div className="flex flex-col h-full justify-evenly">
          <TextLinesLimiter
            className="-mb-px font-bold text-general"
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

export const DirectionItem = ({ item, onClick = null, active }) => (
  <ItemContainer
    onClick={onClick}
    active={active}
    className="flex h-[50px]"
    noPadding
  >
    {item?.image && (
      <img
        className="object-cover h-[50px] 1"
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
  active,
  bordered = false,
}) => {
  const service = useAtomValue(serviceSelector(serviceId))
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
  active,
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
  active,
  noBorder = false,
  checkable,
  className,
  showUser = true,
  showEvent = true,
  showSectorIcon = true,
}) => {
  const paymentSector = paymentSectorFunc(item)
  const sectorProps = SECTORS.find((sector) => sector.value === paymentSector)
  const referralReward = item?.referralReward ?? null
  const referralRewardFor = referralReward?.rewardFor ?? null

  const referralCouponIcon =
    referralRewardFor === 'referrer'
      ? faUserTie
      : referralRewardFor === 'referral'
        ? faUserPlus
        : faGift

  const referralCouponTooltip =
    referralRewardFor === 'referrer'
      ? 'Реферальный купон для пригласившего'
      : referralRewardFor === 'referral'
        ? 'Реферальный купон для приглашённого'
        : 'Реферальный купон'

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
            className="w-6 h-6 min-h-6"
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
            <div className="text-sm leading-4 line-clamp-1">{item.comment}</div>
          )}
        </div>
        <div className="flex justify-end flex-1 gap-x-3">
          {item.isReferralCoupon && (
            <IconWithTooltip
              icon={referralCouponIcon}
              className="text-general"
              tooltip={referralCouponTooltip}
            />
          )}
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
