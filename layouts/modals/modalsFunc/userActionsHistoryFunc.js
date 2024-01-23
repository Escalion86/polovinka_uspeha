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
import UserName from '@components/UserName'
import ComboBox from '@components/ComboBox'
import { SelectEventList, SelectPaymentList } from '@components/SelectItemList'
import DirectionTitleById from '@components/DirectionTitleById'
import AdditionalBlockTitleById from '@components/AdditionalBlockTitleById'

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

const keysComponents = {
  events: { KeyValueComponent: EventKeyValueItem, keys: eventKeys },
  users: { KeyValueComponent: UserKeyValueItem, keys: userKeys },
  payments: { KeyValueComponent: PaymentKeyValueItem, keys: paymentKeys },
  // eventsusers: {Component: UserKeyValueItem, keys: userKeys},
}

const HistoryItemContent = ({ data, schema, userId, difference }) => {
  const arrayOfItems = []
  if (['events', 'users', 'payments'].includes(schema)) {
    for (const [key, value] of Object.entries(data[0]))
      if (!['_id', 'createdAt', 'updatedAt', '__v'].includes(key)) {
        const { keys, KeyValueComponent } = keysComponents[schema]
        arrayOfItems.push(
          <div key={data[0]._id + schema + key} className="flex flex-col">
            <div className="font-bold">{keys[key]}</div>
            {difference ? (
              <DifferenceComponent
                objKey={key}
                value={value}
                KeyValueItem={KeyValueComponent}
              />
            ) : (
              <KeyValueComponent objKey={key} value={value} />
            )}
          </div>
        )
      }
  } else if (schema === 'eventsusers') {
    arrayOfItems.push(
      <EventItemFromId
        key={data[0]._id + schema}
        eventId={data[0].eventId}
        bordered
      />
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

  // console.log('schema :>> ', schema)

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
          {schema === 'directions' && (
            <div className="h-5 -mt-0.5 leading-[14px]">
              <DirectionTitleById directionId={data[0]._id} />
            </div>
          )}
          {schema === 'additionalblocks' && (
            <div className="h-5 -mt-0.5 leading-[14px]">
              <AdditionalBlockTitleById additionalBlockId={data[0]._id} />
            </div>
          )}
          {schema === 'events' && (
            <SelectEventList eventsId={[data[0]._id]} readOnly />
          )}
          {schema === 'payments' && (
            <SelectPaymentList paymentsId={[data[0]._id]} readOnly />
          )}
          {schema === 'users' && (
            <div className="h-5 -mt-0.5 leading-[14px]">
              {userId === data[0]._id ? (
                'Себя'
              ) : (
                <UserNameById userId={data[0]._id} trunc={1} />
              )}
            </div>
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
    const [periodHours, setPeriodHours] = useState(24)

    const [filter, setFilter] = useState(null)

    if (!user || !userId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Пользователь не найден!
        </div>
      )

    useEffect(() => {
      const fetchData = async () => {
        var cutoff = new Date()
        cutoff.setHours(cutoff.getHours() - periodHours)
        const result = await getData(`/api/histories`, {
          userId,
          createdAt: { $gte: cutoff },
        })
        setUserActionsHistory(result)
      }
      fetchData().catch(console.error)
    }, [periodHours])

    const filteredUserActionsHistory = filter
      ? userActionsHistory.filter(({ schema }) => schema === filter)
      : userActionsHistory

    return (
      <div className="flex flex-col items-center flex-1 gap-y-2">
        <div className="text-lg font-bold text-general">
          <UserName user={user} />
        </div>
        <div className="flex flex-wrap justify-center gap-x-2">
          <ComboBox
            label="Период"
            value={String(periodHours)}
            onChange={(value) => setPeriodHours(Number(value))}
            items={[
              { name: '1 час', value: 1 },
              { name: '2 часа', value: 2 },
              { name: '3 часа', value: 3 },
              { name: '6 часов', value: 6 },
              { name: '12 часов', value: 12 },
              { name: 'Сутки', value: 24 },
              { name: '2 суток', value: 48 },
              { name: '3 суток', value: 72 },
              { name: 'Неделю', value: 168 },
              { name: '2 недели', value: 336 },
              { name: 'Месяц', value: 720 },
              { name: 'За все время', value: 999999 },
            ]}
            smallMargin
          />
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
        </div>
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
          <div className="flex flex-col-reverse flex-1 w-full max-h-[calc(100vh-180px)] tablet:max-h-[calc(100vh-232px)] py-0.5 overflow-y-auto gap-y-1">
            {filteredUserActionsHistory
              ? filteredUserActionsHistory.map((props) => (
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
