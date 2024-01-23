import HistoryItem from '@components/HistoryItem'
import LoadingSpinner from '@components/LoadingSpinner'
import { getData } from '@helpers/CRUD'
import compareObjectsWithDif from '@helpers/compareObjectsWithDif'
import userSelector from '@state/selectors/userSelector'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import UserKeyValueItem from './historyKeyValuesItems/UserKeyValueItem'
import { userKeys } from './historyKeyValuesItems/keys'
import UserName from '@components/UserName'
import ComboBox from '@components/ComboBox'

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
    const [userHistory, setUserHistory] = useState()
    const [periodHours, setPeriodHours] = useState(24)

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
          schema: 'users',
          'data._id': userId,
          createdAt: { $gte: cutoff },
        })
        setUserHistory(result)
      }
      fetchData().catch(console.error)
    }, [periodHours])

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
        {userHistory ? (
          <div className="flex flex-col-reverse flex-1 w-full max-h-[calc(100vh-180px)] tablet:max-h-[calc(100vh-232px)] py-0.5 overflow-y-auto gap-y-1">
            {userHistory.length === 0
              ? 'Нет записей'
              : userHistory.map(
                  (
                    { action, data, userId, createdAt, _id, difference },
                    index
                  ) => {
                    const changes = difference
                      ? data[0]
                      : compareObjectsWithDif(
                          index > 0 ? userHistory[index - 1].data[0] : {},
                          data[0]
                        )

                    return (
                      <HistoryItem
                        key={_id}
                        action={action}
                        changes={changes}
                        createdAt={createdAt}
                        userId={userId}
                        KeyValueItem={UserKeyValueItem}
                        keys={userKeys}
                      />
                    )
                  }
                )}
          </div>
        ) : (
          <LoadingSpinner />
        )}
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
