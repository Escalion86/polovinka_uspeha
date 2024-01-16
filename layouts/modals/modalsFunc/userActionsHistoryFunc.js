import LoadingSpinner from '@components/LoadingSpinner'
import {
  faAdd,
  faAngleDown,
  faRefresh,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getData } from '@helpers/CRUD'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import userSelector from '@state/selectors/userSelector'
import cn from 'classnames'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import EventKeyValueItem from './historyKeyValuesItems/EventKeyValueItem'
import UserKeyValueItem from './historyKeyValuesItems/UserKeyValueItem'
import PaymentKeyValueItem from './historyKeyValuesItems/PaymentKeyValueItem'
import { eventKeys, paymentKeys, userKeys } from './historyKeyValuesItems/keys'
import { EventItemFromId } from '@components/ItemCards'
import UserNameById from '@components/UserNameById'

const schemasNames = {
  events: 'Мероприятия',
  users: 'Пользователи',
  services: 'Услуги',
  products: 'Товары',
  payments: 'Транзакции',
  reviews: 'Отзывы',
  additionalblocks: 'Дополнительные блоки',
  directions: 'Направления',
  eventsusers: 'Запись на мероприятие',
}

const DifferenceComponent = ({ objKey, value, KeyValueItem }) => (
  <div>
    <div className="flex mt-1 gap-x-1">
      <div className="italic font-bold border-r-2 w-13 text-danger min-w-13 border-danger">
        Было
      </div>
      <KeyValueItem objKey={objKey} value={value.old} />
    </div>
    <div className="flex pb-1 mt-1 gap-x-1">
      <div className="italic font-bold border-r-2 w-13 text-success min-w-13 border-success">
        Стало
      </div>
      <KeyValueItem objKey={objKey} value={value.new} />
    </div>
  </div>
)

const HistoryItemContent = ({ data, schema, userId, difference }) => {
  // return <div>{data.map((item) => item._id)}</div>
  const arrayOfItems = []
  if (schema === 'events')
    for (const [key, value] of Object.entries(data[0]))
      if (!['_id', 'createdAt', 'updatedAt', '__v'].includes(key))
        if (difference)
          arrayOfItems.push(
            <DifferenceComponent
              objKey={key}
              value={value}
              KeyValueItem={EventKeyValueItem}
            />
          )
        else
          arrayOfItems.push(
            <div className="flex flex-col gap-y-1">
              <div className="font-bold">{eventKeys[key]}</div>
              <EventKeyValueItem objKey={key} value={value} />
            </div>
          )

  if (schema === 'users')
    for (const [key, value] of Object.entries(data[0]))
      if (!['_id', 'createdAt', 'updatedAt', '__v'].includes(key))
        if (difference)
          arrayOfItems.push(
            <DifferenceComponent
              objKey={key}
              value={value}
              KeyValueItem={UserKeyValueItem}
            />
          )
        else
          arrayOfItems.push(
            <div className="flex flex-col gap-y-1">
              <div className="font-bold">{userKeys[key]}</div>
              <UserKeyValueItem objKey={key} value={value} />
            </div>
          )

  if (schema === 'payments')
    for (const [key, value] of Object.entries(data[0]))
      if (!['_id', 'createdAt', 'updatedAt', '__v'].includes(key))
        if (difference)
          arrayOfItems.push(
            <DifferenceComponent
              objKey={key}
              value={value}
              KeyValueItem={UserKeyValueItem}
            />
          )
        else
          arrayOfItems.push(
            <div className="flex flex-col gap-y-1">
              <div className="font-bold">{paymentKeys[key]}</div>
              <PaymentKeyValueItem objKey={key} value={value} />
            </div>
          )
  if (schema === 'eventsusers') {
    arrayOfItems.push(
      <>
        {userId === data[0].userId ? (
          'Себя'
        ) : (
          <UserNameById userId={data[0].userId} />
        )}
        <EventItemFromId eventId={data[0].eventId} bordered />
      </>
    )
  }

  return <div className="flex flex-col pb-1 gap-y-1">{arrayOfItems}</div>
}

const HistoryActionsItem = ({
  action,
  data,
  schema,
  createdAt,
  _id,
  userId,
  difference,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [createdAtDate, createdAtTime] = dateToDateTimeStr(
    createdAt,
    true,
    false
  )
  return (
    <div
      className="flex flex-col px-1 border border-gray-500 rounded-lg cursor-pointer hover:bg-gray-100"
      onClick={() => {
        setIsCollapsed((state) => !state)
      }}
    >
      <div className="flex items-center py-1 gap-x-2">
        <FontAwesomeIcon
          className={cn('w-5', action === 'add' ? 'h-5' : 'h-4')}
          icon={
            action === 'add' ? faAdd : action === 'delete' ? faTrash : faRefresh
          }
          color={
            action === 'add' ? 'green' : action === 'delete' ? 'red' : 'blue'
          }
        />
        <div className="font-bold text-general">
          {schemasNames[schema] ?? schema}
        </div>
        <div className="flex-1 flex gap-y-0.5 gap-x-2 justify-end">
          <div className="flex items-center gap-x-2">
            <div className="flex text-sm flex-nowrap tablet:text-base gap-x-1">
              <span className="whitespace-nowrap">{createdAtDate}</span>
              <span className="font-bold">{createdAtTime}</span>
            </div>
          </div>
        </div>
        <div
          className={cn(
            'w-4 duration-300 transition-transform flex items-center justify-center',
            {
              'rotate-180': isCollapsed,
            }
          )}
        >
          <FontAwesomeIcon icon={faAngleDown} size="lg" />
        </div>
      </div>
      <motion.div
        className="overflow-hidden"
        initial={{ height: 0 }}
        animate={{ height: isCollapsed ? 0 : 'auto' }}
      >
        {!isCollapsed && (
          <HistoryItemContent
            data={data}
            schema={schema}
            userId={userId}
            difference={difference}
          />
        )}
      </motion.div>
    </div>
  )

  // return (
  //   <pre>
  //     {JSON.stringify({ action, data, schema, createdAt, _id })}
  //   </pre>
  // )
  // const changes = compareObjectsWithDif(
  //   index > 0 ? userHistory[index - 1].data[0] : {},
  //   data[0]
  // )

  // // console.log('changes :>> ', changes)

  // return (
  //   <HistoryItem
  //     key={_id}
  //     action={action}
  //     changes={changes}
  //     createdAt={createdAt}
  //     userId={userId}
  //     KeyValueItem={KeyValueItem}
  //     keys={userKeys}
  //   />
  // )
}

const userActionsHistoryFunc = (userId) => {
  const UserActionsHistoryModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const user = useRecoilValue(userSelector(userId))
    const [userActionsHistory, setUserActionsHistory] = useState()

    if (!user || !userId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Пользователь не найден!
        </div>
      )

    // useEffect(refresh, [])

    useEffect(() => {
      const fetchData = async () => {
        const result = await getData(`/api/histories`, {
          userId,
        })
        setUserActionsHistory(result)
      }
      fetchData().catch(console.error)
    }, [])

    return (
      <div className="flex flex-col items-center flex-1 gap-y-2">
        {/* <div className="text-lg font-bold">{event.title}</div> */}
        {/* <DateTimeEvent
          wrapperClassName="text-base laptop:text-lg font-bold leading-4 laptop:leading-5 justify-center laptop:justify-start"
          dateClassName="text-general"
          timeClassName="italic"
          durationClassName="italic text-base font-normal"
          event={event}
          showDayOfWeek
          fullMonth
        /> */}
        {userActionsHistory ? (
          <div className="flex flex-col-reverse w-full gap-y-1">
            {userActionsHistory.map((props, index) => (
              <HistoryActionsItem key={props._id} {...props} />
            ))}
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    )
  }

  return {
    title: `История изменений пользователя`,
    Children: UserActionsHistoryModal,
    declineButtonName: 'Закрыть',
    showDecline: true,
  }
}

export default userActionsHistoryFunc
