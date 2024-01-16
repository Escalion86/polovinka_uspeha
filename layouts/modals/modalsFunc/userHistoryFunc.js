import CardButton from '@components/CardButton'
import HistoryItem from '@components/HistoryItem'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'
import compareObjectsWithDif from '@helpers/compareObjectsWithDif'
import formatDateTime from '@helpers/formatDateTime'
import { historiesOfUserSelector } from '@state/atoms/historiesOfUserAtom'
import userSelector from '@state/selectors/userSelector'
import { useEffect } from 'react'
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil'

const userKeys = {
  firstName: 'Имя',
  secondName: 'Фамилия',
  thirdName: 'Отчество',
  email: 'eMail',
  password: 'Пароль',
  images: 'Фотографии',
  gender: 'Пол',
  relationship: 'Статус отношений',
  personalStatus: 'Персональный статус',
  about: 'Обо мне',
  interests: 'Интересы',
  profession: 'Профессия',
  orientation: 'Ориентация',
  phone: 'Телефон',
  whatsapp: 'Whatsapp',
  viber: 'Viber',
  telegram: 'Telegram',
  instagram: 'Instagram',
  vk: 'ВКонтакте',
  birthday: 'День рождения',
  role: 'Роль',
  status: 'Статус в проекте',
  lastActivityAt: 'Время последней активности',
  prevActivityAt: 'Время предпоследней активности',
  archive: 'В архиве',
  haveKids: 'Есть дети',
  security: 'Настройки конфиденциальности',
  notifications: 'Настройки уведомлений',
  soctag: 'Социальный тэг',
  custag: 'Кастомный тэг',
}

const KeyValueItem = ({ objKey, value }) =>
  value === null || value === undefined ? (
    '[не указано]'
  ) : [
      'firstName',
      'secondName',
      'thirdName',
      'email',
      'password',
      'about',
      'interests',
      'soctag',
      'custag',
      'personalStatus',
    ].includes(objKey) ? (
    value
  ) : ['birthday', 'lastActivityAt', 'prevActivityAt'].includes(objKey) ? (
    formatDateTime(value)
  ) : //  : objKey === 'comment' ? (
  //   value
  // ) : objKey === 'userId' ? (
  //   <UserNameById userId={value} thin trunc={1} />
  // ) : objKey === 'payAt' ? (
  //   formatDateTime(value)
  // ) : objKey === 'sum' ? (
  //   value / 100 + ' ₽'
  // ) : objKey === 'eventId' ? (
  //   <EventItemFromId eventId={value} bordered />
  // ) : objKey === 'serviceId' ? (
  //   <ServiceItemFromId serviceId={value} bordered />
  // ) : objKey === 'payDirection' ? (
  //   payDirectionObj[value]
  // ) : objKey === 'status' ? (
  //   value
  // ) :
  // objKey=== 'productId' ? (value ? (
  //   <ProductItemFromId productId={value} bordered />
  // ) : (
  // 'не выбрано'
  // ) :
  // objKey === 'payType' ? (
  //   PAY_TYPES.find((item) => item.value === value)?.name
  // ) :
  typeof value === 'object' ? (
    <pre>{JSON.stringify(value)}</pre>
  ) : typeof value === 'boolean' ? (
    value ? (
      'Да'
    ) : (
      'Нет'
    )
  ) : (
    value
  )

const userHistoryFunc = (userId) => {
  const UserHistoryModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const user = useRecoilValue(userSelector(userId))
    const userHistory = useRecoilValue(historiesOfUserSelector(userId))
    const refresh = useRecoilRefresher_UNSTABLE(historiesOfUserSelector(userId))

    if (!user || !userId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Пользователь не найден!
        </div>
      )

    useEffect(refresh, [])

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
        <div className="flex flex-col w-full gap-y-1">
          {userHistory.map(
            ({ action, data, userId, createdAt, _id }, index) => {
              const changes = compareObjectsWithDif(
                index > 0 ? userHistory[index - 1].data[0] : {},
                data[0]
              )

              // console.log('changes :>> ', changes)

              return (
                <HistoryItem
                  key={_id}
                  action={action}
                  changes={changes}
                  createdAt={createdAt}
                  userId={userId}
                  KeyValueItem={KeyValueItem}
                  keys={userKeys}
                />
              )
            }
          )}
        </div>
      </div>
    )
  }

  return {
    title: `История изменений пользователя`,
    Children: UserHistoryModal,
    declineButtonName: 'Закрыть',
    showDecline: true,
  }
}

export default userHistoryFunc
