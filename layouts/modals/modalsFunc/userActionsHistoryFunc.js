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
import { EventItem, EventItemFromId } from '@components/ItemCards'
import UserNameById from '@components/UserNameById'
import UserName from '@components/UserName'
import ComboBox from '@components/ComboBox'
import { SelectEventList, SelectPaymentList } from '@components/SelectItemList'

const schemasNames = {
  events: 'Мероприятие',
  users: 'Пользователь',
  services: 'Услуга',
  products: 'Товар',
  payments: 'Транзакция',
  reviews: 'Отзыв',
  additionalblocks: 'Дополнительный блок',
  directions: 'Направление',
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
        arrayOfItems.push(
          <div className="flex flex-col">
            <div className="font-bold">{eventKeys[key]}</div>
            {difference ? (
              <DifferenceComponent
                objKey={key}
                value={value}
                KeyValueItem={EventKeyValueItem}
              />
            ) : (
              <EventKeyValueItem objKey={key} value={value} />
            )}
          </div>
        )

  if (schema === 'users')
    for (const [key, value] of Object.entries(data[0]))
      if (!['_id', 'createdAt', 'updatedAt', '__v'].includes(key))
        arrayOfItems.push(
          <div className="flex flex-col">
            <div className="font-bold">{userKeys[key]}</div>
            {difference ? (
              <DifferenceComponent
                objKey={key}
                value={value}
                KeyValueItem={UserKeyValueItem}
              />
            ) : (
              <UserKeyValueItem objKey={key} value={value} />
            )}
          </div>
        )

  if (schema === 'payments')
    for (const [key, value] of Object.entries(data[0]))
      if (!['_id', 'createdAt', 'updatedAt', '__v'].includes(key))
        arrayOfItems.push(
          <div className="flex flex-col">
            <div className="font-bold">{paymentKeys[key]}</div>
            {difference ? (
              <DifferenceComponent
                objKey={key}
                value={value}
                KeyValueItem={PaymentKeyValueItem}
              />
            ) : (
              <PaymentKeyValueItem objKey={key} value={value} />
            )}
          </div>
        )

  if (schema === 'eventsusers') {
    arrayOfItems.push(
      // <div className="flex flex-col gap-y-0.5">

      <EventItemFromId eventId={data[0].eventId} bordered />
      // </div>
    )
  }

  return <div className="pb-1">{arrayOfItems}</div>
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
      <div className="flex flex-col">
        <div className="flex items-center py-1 gap-x-2">
          <FontAwesomeIcon
            className={cn('w-5', action === 'add' ? 'h-5' : 'h-4')}
            icon={
              action === 'add'
                ? faAdd
                : action === 'delete'
                ? faTrash
                : faRefresh
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
        <div>
          {schema === 'events' && (
            <SelectEventList eventsId={[data[0]._id]} readOnly />
          )}
          {schema === 'payments' && (
            <SelectPaymentList paymentsId={[data[0]._id]} readOnly />
          )}
          {schema === 'eventsusers' && (
            <div className="h-5 -mt-0.5 leading-[14px]">
              {userId === data[0].userId ? (
                'Себя'
              ) : (
                <UserNameById userId={data[0].userId} trunc={1} />
              )}
            </div>
          )}
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

    const [filter, setFilter] = useState(null)

    if (!user || !userId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Пользователь не найден!
        </div>
      )

    useEffect(() => {
      const fetchData = async () => {
        const result = await getData(`/api/histories`, {
          userId,
        })
        setUserActionsHistory(result)
      }
      fetchData().catch(console.error)
    }, [])

    const filteredUserActionsHistory = filter
      ? userActionsHistory.filter(({ schema }) => schema === filter)
      : userActionsHistory

    return (
      <div className="flex flex-col items-center flex-1 gap-y-2">
        <div className="text-lg font-bold text-general">
          <UserName user={user} />
        </div>
        <ComboBox
          label="Блоки"
          value={filter}
          onChange={setFilter}
          items={[
            // { name: 'Все', value: null },
            ...Object.entries(schemasNames).map(([value, name]) => ({
              name,
              value,
            })),
          ]}
          activePlaceholder
          placeholder="Все"
          // activePlaceholder={activePlaceholder}
          smallMargin
          // required={required}
          // error={error}
          // fullWidth={fullWidth}
        />
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
            {filteredUserActionsHistory
              ? filteredUserActionsHistory.map((props, index) => (
                  <HistoryActionsItem key={props._id} {...props} />
                ))
              : 'Нет действий'}
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    )
  }

  return {
    title: `История действий пользователя`,
    Children: UserActionsHistoryModal,
    declineButtonName: 'Закрыть',
    showDecline: true,
  }
}

export default userActionsHistoryFunc
