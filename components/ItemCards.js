import { faCheck, faGenderless } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import birthDateToAge from '@helpers/birthDateToAge'
import {
  EVENT_STATUSES,
  EVENT_STATUSES_WITH_TIME,
  GENDERS,
  PAY_TYPES,
} from '@helpers/constants'
import eventStatusFunc from '@helpers/eventStatus'
import formatDateTime from '@helpers/formatDateTime'
import getUserAvatarSrc from '@helpers/getUserAvatarSrc'
import sanitize from '@helpers/sanitize'
import directionSelector from '@state/selectors/directionSelector'
import eventSelector from '@state/selectors/eventSelector'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'
import userSelector from '@state/selectors/userSelector'
import cn from 'classnames'
import Image from 'next/image'
import { useRecoilValue } from 'recoil'
import DateTimeEvent from './DateTimeEvent'
import EventNameById from './EventNameById'
import TextLinesLimiter from './TextLinesLimiter'
import UserName from './UserName'
import UserNameById from './UserNameById'
import UserStatusIcon from './UserStatusIcon'

const ItemContainer = ({
  onClick,
  active,
  children,
  noPadding = false,
  className,
  noBorder,
  checkable = true,
  style,
}) => (
  <div
    className={cn(
      'relative flex w-full h-full max-w-full',
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
          'absolute flex items-center top-0 bottom-0 left-0 overflow-hidden duration-300 bg-green-400',
          active ? 'w-7' : 'w-0'
        )}
      >
        <FontAwesomeIcon icon={faCheck} className="w-5 h-5 ml-1 text-white" />
      </div>
    )}
    {children}
  </div>
)

// export const ProductItem = ({ item, onClick = null, active = false }) => (
//   // <Tooltip
//   //   title={
//   //     <div className="text-xs">
//   //       {product?.name}
//   //       <br />
//   //       Артикул:{' '}
//   //       {product?.article ? '(' + product.article + ')' : 'отсутствует'}
//   //       <br />В наличии: {product?.count ? product.count : '0'} шт.
//   //     </div>
//   //   }
//   //   arrow
//   //   placement="top"
//   //   // enterDelay={1000}
//   //   // leaveDelay={0}
//   // >
//   <ItemContainer onClick={onClick} active={active}>
//     <div className="h-5 text-sm font-semibold text-gray-800 truncate">
//       {item.name}
//     </div>
//     <div className="flex items-center text-xs text-gray-600 gap-x-2">
//       <div className="flex-2 whitespace-nowrap">
//         Артикул: {item.article || '[нет]'}
//       </div>
//       <div className="flex-1 text-center whitespace-nowrap">
//         {item.count} шт
//       </div>
//       <div className="flex-1 text-right whitespace-nowrap">
//         {item.price / 100} ₽
//       </div>
//     </div>
//   </ItemContainer>
//   // </Tooltip>
// )

// export const SetItem = (props) => ProductItem(props)
export const UserItemFromId = ({
  userId,
  onClick = null,
  active = false,
  noBorder,
}) => {
  const user = useRecoilValue(userSelector(userId))
  return (
    <UserItem
      item={user}
      active={active}
      onClick={onClick}
      noBorder={noBorder}
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
}) => {
  const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)

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
      <div
        className={cn(
          'w-6 tablet:w-7 flex justify-center items-center h-full',
          userGender ? 'bg-' + userGender.color : 'bg-gray-400'
        )}
      >
        <FontAwesomeIcon
          className="w-5 h-5 text-white tablet:w-6 tablet:h-6"
          icon={userGender ? userGender.icon : faGenderless}
        />
      </div>
      <img
        className="object-cover h-10 aspect-1"
        src={getUserAvatarSrc(item)}
        alt="user"
      />
      <div className="flex items-center flex-1 py-0.5 px-1">
        <div className="flex flex-wrap items-center flex-1 max-h-full text-xs text-gray-800 phoneH:text-sm tablet:text-base gap-x-1 gap-y-0.5">
          <UserName user={item} className="font-semibold" thin />
          {item.birthday &&
            (isLoggedUserModer ||
              item.security?.showBirthday === true ||
              item.security?.showBirthday === 'full') && (
              <span className="overflow-visible italic leading-4 max-h-3 -mt-0.5">
                {' (' + birthDateToAge(item.birthday) + ')'}
              </span>
            )}
        </div>
        {/* <div className="flex flex-wrap items-center justify-between flex-1 h-4 overflow-hidden text-xs text-gray-600 max-h-4 gap-x-2">
          <div className="whitespace-nowrap">
            Телефон: {item.phone ? '+' + item.phone : '[нет]'}
          </div>
          {item.whatsapp && (
            <div className="whitespace-nowrap">
              WhatsApp: {item.whatsapp ? '+' + item.whatsapp : '[нет]'}
            </div>
          )}
          {item.email && (
            <div className="whitespace-nowrap">
              Email: {item.email || '[нет]'}
            </div>
          )}
        </div> */}
        <UserStatusIcon status={item.status} />
      </div>
    </ItemContainer>
    // </Tooltip>
  )
}

export const EventItemFromId = ({
  eventId,
  onClick = null,
  active = false,
}) => {
  const event = useRecoilValue(eventSelector(eventId))
  return <EventItem item={event} active={active} onClick={onClick} />
}

export const EventItem = ({ item, onClick = null, active = false }) => {
  const direction = useRecoilValue(directionSelector(item.directionId))

  const eventStatus = eventStatusFunc(item)
  const eventStatusObj = EVENT_STATUSES_WITH_TIME.find(
    (data) => data.value === eventStatus
  )

  return (
    <ItemContainer
      onClick={onClick}
      active={active}
      className="flex text-xs tablet:text-sm h-[33px]"
      noPadding
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
      <div className="flex items-center justify-between flex-1 px-1 leading-3">
        <div className="flex flex-col h-full justify-evenly">
          <TextLinesLimiter className="font-bold text-general" lines={1}>
            {direction.title}
          </TextLinesLimiter>
          <TextLinesLimiter className="font-bold text-gray-800" lines={1}>
            {item.title}
          </TextLinesLimiter>
        </div>
        <div className="text-gray-600 gap-x-2">
          {/* <div className="flex-2 whitespace-nowrap">
        Артикул: {item.а || '[нет]'}
      </div> */}
          <DateTimeEvent
            wrapperClassName="flex-1 font-bold justify-end"
            dateClassName="text-general"
            timeClassName="italic"
            durationClassName="italic font-normal"
            event={item}
            showDayOfWeek
            // fullMonth
            thin
            twoLines
            // showDuration
          />
          {/* {formatDateTime(item.date, false, false, true, true, true)} */}
          {/* <div className="flex-1 w-10 text-right whitespace-nowrap">
        {item.price ? item.price / 100 : 0} ₽
      </div> */}
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
      // <div className="flex justify-center w-full tablet:w-auto">
      <img
        className="object-cover h-[50px] aspect-1"
        src={item.image}
        alt="direction"
        // width={48}
        // height={48}
      />
      // </div>
    )}
    <div className="px-1">
      <div className="h-5 text-sm font-bold text-gray-800 truncate">
        {item.title}
      </div>
      <div className="flex items-center text-xs text-gray-600 gap-x-2">
        {/* <div className="flex-2 whitespace-nowrap">
        Артикул: {item.а || '[нет]'}
      </div> */}
        {/* <div className="flex-1 whitespace-nowrap">
        {formatDateTime(item.date, false)}
      </div> */}
        <TextLinesLimiter
          dangerouslySetInnerHTML={{
            __html: sanitize(item.description),
          }}
          className="w-full overflow-hidden textarea flex-1 max-w-full leading-[0.85rem]"
          lines={2}
        />
      </div>
    </div>
  </ItemContainer>
)

export const ServiceItem = ({ item, onClick = null, active = false }) => (
  <ItemContainer
    onClick={onClick}
    active={active}
    className="flex h-[50px]"
    noPadding
  >
    {item?.images && item?.images.length > 0 && (
      // <div className="flex justify-center w-full tablet:w-auto">
      <img
        className="object-cover h-[50px] aspect-1"
        src={item.images[0]}
        alt="direction"
        // width={48}
        // height={48}
      />
      // </div>
    )}
    <div className="px-1">
      <div className="h-5 text-sm font-bold text-gray-800 truncate">
        {item.title}
      </div>
      <div className="flex items-center text-xs text-gray-600 gap-x-2">
        {/* <div className="flex-2 whitespace-nowrap">
        Артикул: {item.а || '[нет]'}
      </div> */}
        {/* <div className="flex-1 whitespace-nowrap">
        {formatDateTime(item.date, false)}
      </div> */}
        <TextLinesLimiter
          // dangerouslySetInnerHTML={{
          //   __html: sanitize(item.description),
          // }}
          className="w-full overflow-hidden textarea flex-1 max-w-full leading-[0.85rem]"
          lines={2}
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
  showUserOrEvent = false,
}) => {
  const payType = PAY_TYPES.find(
    (payTypeItem) => payTypeItem.value === item.payType
  )
  return (
    <ItemContainer
      onClick={onClick}
      active={active}
      // className="flex gap-x-1"
      noPadding
      noBorder={noBorder}
      className={cn('flex h-9', className)}
      checkable={checkable}
    >
      <div
        className={cn(
          'flex items-center justify-center w-8 text-white',
          payType ? 'bg-' + payType.color : 'bg-gray-400'
        )}
      >
        <FontAwesomeIcon icon={payType?.icon ?? faQuestion} className="w-6" />
      </div>
      <div className="flex items-center justify-between flex-1 w-full px-1 gap-x-1">
        <div className="flex flex-col">
          <div className="text-sm font-bold leading-4 text-gray-800 truncate">
            {formatDateTime(item.payAt)}
          </div>
          {showUserOrEvent &&
            (item.payDirection === 'toUser' ||
              item.payDirection === 'fromUser') && (
              <UserNameById
                userId={item.userId}
                noWrap
                className="font-bold leading-4"
              />
            )}
          {showUserOrEvent &&
            (item.payDirection === 'toEvent' ||
              item.payDirection === 'fromEvent') && (
              <EventNameById
                eventId={item.eventId}
                className="font-bold leading-4 text-general"
              />
            )}
          {item.comment && (
            <div className="text-sm leading-4">{item.comment}</div>
          )}
        </div>
        <div className="flex items-center text-xs gap-x-2">
          <div
            className={cn(
              'px-1 text-sm font-bold phoneH:text-base',
              item.payDirection === 'toUser' || item.payDirection === 'toEvent'
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
        </div>
      </div>
    </ItemContainer>
  )
}

// export const PaymentItem = ({ item, onClick = null, active = false }) => {
//   const { orders, clients } = useSelector((state) => state)
//   const order = item.orderId
//     ? orders.find((order) => order._id === item.orderId)
//     : null
//   const client = item.clientId
//     ? clients.find((client) => client._id === item.clientId)
//     : null
//   return (
//     <ItemContainer onClick={() => onClick(item)} active={active}>
//       <div className="flex justify-between h-5 text-sm text-gray-800 truncate">
//         <div>№ {item.number}</div>
//         {order && <div>Заказ №{order.number}</div>}
//         {client && <div>Клиент: {client.name}</div>}
//       </div>
//       <div className="flex items-center text-xs text-gray-600 gap-x-2">
//         <div className="flex-1 whitespace-nowrap">
//           {formatDateTime(item.payAt, false)}
//         </div>
//         <div className="flex-1 text-right whitespace-nowrap">
//           {item.payType}
//         </div>
//         <div className="flex-1 text-right whitespace-nowrap">
//           {item.sum / 100} ₽
//         </div>
//       </div>
//     </ItemContainer>
//   )
// }
