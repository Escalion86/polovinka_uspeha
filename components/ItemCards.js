import birthDateToAge from '@helpers/birthDateToAge'
import formatDateTime from '@helpers/formatDateTime'
// import roleRus from '@helpers/roleRus'
// import { useSelector } from 'react-redux'
import cn from 'classnames'

const ItemContainer = ({
  onClick,
  active,
  children,
  noPadding = false,
  className,
}) => (
  <div
    className={cn(
      'w-full max-w-full border-b border-gray-700 last:border-0',
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

export const UserItem = ({ item, onClick = null, active = false }) => (
  <ItemContainer onClick={onClick} active={active} noPadding className="flex">
    {item.image && (
      <img
        className="object-cover h-10 aspect-1"
        src={item.image}
        alt="user"
        // width={48}
        // height={48}
      />
    )}
    <div className="py-0.5 px-1">
      <div className="flex h-5 text-sm text-gray-800 truncate gap-x-1">
        <span className="font-semibold">{item.name}</span>
        {item.secondname && (
          <span className="font-semibold">{item.secondname}</span>
        )}
        {item.thirdname && (
          <span className="font-semibold">{item.thirdname}</span>
        )}
        {item.birthday && (
          <span className="italic">
            {' (' + birthDateToAge(item.birthday) + ')'}
          </span>
        )}
      </div>
      <div className="flex items-center overflow-x-hidden text-xs text-gray-600 gap-x-2">
        <div className="flex-1 whitespace-nowrap">
          Телефон: {item.phone ? '+' + item.phone : '[нет]'}
        </div>
        {item.whatsapp && (
          <div className="flex-1 text-center whitespace-nowrap">
            WhatsApp: +{item.whatsapp ? '+' + item.whatsapp : [нет]}
          </div>
        )}
        {item.email && (
          <div className="flex-1 text-right whitespace-nowrap">
            Email: {item.email || '[нет]'}
          </div>
        )}
      </div>
    </div>
  </ItemContainer>
  // </Tooltip>
)

export const EventItem = ({ item, onClick = null, active = false }) => (
  <ItemContainer onClick={onClick} active={active}>
    <div className="h-5 text-sm font-bold text-gray-800 truncate">
      {item.title}
    </div>
    <div className="flex items-center text-xs text-gray-600 gap-x-2">
      {/* <div className="flex-2 whitespace-nowrap">
        Артикул: {item.а || '[нет]'}
      </div> */}
      <div className="flex-1 whitespace-nowrap">
        {formatDateTime(item.date, false)}
      </div>
      <div className="flex-1 text-right whitespace-nowrap">
        {item.price ? item.price / 100 : 0} ₽
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
//     <ItemContainer onClick={onClick} active={active}>
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

// export const DistrictItem = ({ item, onClick = null, active = false }) => (
//   <ItemContainer onClick={onClick} active={active}>
//     <div className="flex justify-between">
//       <div className="text-sm text-gray-800 truncate">{item.name}</div>
//       <div className="flex-1 text-sm text-right whitespace-nowrap">
//         {item.deliveryPrice / 100} ₽
//       </div>
//     </div>
//   </ItemContainer>
// )
