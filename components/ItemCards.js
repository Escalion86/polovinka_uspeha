import {
  faChartPie,
  faCheck,
  faGenderless,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import birthDateToAge from '@helpers/birthDateToAge'
import { GENDERS } from '@helpers/constants'
import formatDateTime from '@helpers/formatDateTime'
import getUserAvatarSrc from '@helpers/getUserAvatarSrc'
import sanitize from '@helpers/sanitize'
// import roleRus from '@helpers/roleRus'
// import { useSelector } from 'react-redux'
import cn from 'classnames'
import Image from 'next/image'

const ItemContainer = ({
  onClick,
  active,
  children,
  noPadding = false,
  className,
}) => (
  <div
    className={cn(
      'relative flex w-full max-w-full border-b border-gray-700 last:border-0',
      { 'hover:bg-blue-200 cursor-pointer': onClick },
      { 'bg-green-200': active },
      { 'py-0.5 px-1': !noPadding },
      className
    )}
    onClick={
      onClick
        ? (e) => {
            e.stopPropagation()
            onClick()
          }
        : null
    }
  >
    <div
      className={cn(
        'absolute flex items-center top-0 bottom-0 left-0 duration-300 bg-green-400',
        active ? 'w-7' : 'w-0'
      )}
    >
      <FontAwesomeIcon icon={faCheck} className="w-5 h-5 ml-1 text-white" />
    </div>
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

export const UserItem = ({ item, onClick = null, active = false }) => {
  const userGender =
    item.gender && GENDERS.find((gender) => gender.value === item.gender)
  return (
    <ItemContainer onClick={onClick} active={active} noPadding className="flex">
      <div
        className={cn(
          'w-7 flex justify-center items-center',
          userGender ? 'bg-' + userGender.color : 'bg-gray-400'
        )}
      >
        <FontAwesomeIcon
          className="w-6 h-6 text-white"
          icon={userGender ? userGender.icon : faGenderless}
        />
      </div>
      <img
        className="object-cover h-10 aspect-1"
        src={getUserAvatarSrc(item)}
        alt="user"
      />
      <div className="flex items-center flex-1 py-0.5 px-1">
        <div className="flex flex-wrap items-center flex-1 text-sm text-gray-800 truncate tablet:text-base gap-x-1">
          <span className="font-semibold">{item.firstName}</span>
          {item.secondName && (
            <span className="font-semibold">{item.secondName}</span>
          )}
          {item.thirdName && (
            <span className="font-semibold">{item.thirdName}</span>
          )}
          {item.birthday && (
            <span className="italic">
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
        <div>
          {item.status === 'member' && (
            <div className="w-6 h-6">
              <Image src="/img/svg_icons/medal.svg" width="24" height="24" />
            </div>
          )}
          {item.status === 'ban' && (
            <div className="w-6 h-6">
              <Image src="/img/svg_icons/ban.svg" width="24" height="24" />
            </div>
          )}
        </div>
      </div>
    </ItemContainer>
    // </Tooltip>
  )
}

export const EventItem = ({ item, onClick = null, active = false }) => (
  <ItemContainer onClick={onClick} active={active} className="justify-between">
    <div className="h-5 text-xs font-bold text-gray-800 truncate tablet:text-sm">
      {item.title}
    </div>
    <div className="flex items-center text-xs text-gray-600 tablet:text-sm gap-x-2">
      {/* <div className="flex-2 whitespace-nowrap">
        Артикул: {item.а || '[нет]'}
      </div> */}
      <div className="flex-1 whitespace-nowrap">
        {formatDateTime(item.date, false)}
      </div>
      {/* <div className="flex-1 w-10 text-right whitespace-nowrap">
        {item.price ? item.price / 100 : 0} ₽
      </div> */}
    </div>
  </ItemContainer>
)

export const DirectionItem = ({ item, onClick = null, active = false }) => (
  <ItemContainer onClick={onClick} active={active} className="flex gap-x-1">
    {item?.image && (
      // <div className="flex justify-center w-full tablet:w-auto">
      <img
        className="object-cover w-12 h-12 min-w-12 max-h-12"
        src={item.image}
        alt="direction"
        // width={48}
        // height={48}
      />
      // </div>
    )}
    <div>
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
        <div
          dangerouslySetInnerHTML={{
            __html: sanitize(item.description),
          }}
          className="textarea flex-1 max-w-full overflow-hidden leading-[0.85rem]"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
          // className="flex-1 h-8 max-w-full overflow-hidden text-clip"
        />
        {/* <div
          className="flex-1 max-w-full"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {item.description}
        </div> */}
      </div>
    </div>
  </ItemContainer>
)

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
