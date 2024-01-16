import HistoryItem from '@components/HistoryItem'
import LoadingSpinner from '@components/LoadingSpinner'
import { getData } from '@helpers/CRUD'
import compareObjectsWithDif from '@helpers/compareObjectsWithDif'
import userSelector from '@state/selectors/userSelector'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import UserKeyValueItem from './historyKeyValuesItems/UserKeyValueItem'
import { userKeys } from './historyKeyValuesItems/keys'

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

    if (!user || !userId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Пользователь не найден!
        </div>
      )

    useEffect(() => {
      const fetchData = async () => {
        const result = await getData(`/api/histories`, {
          schema: 'users',
          'data._id': userId,
        })
        setUserHistory(result)
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
        {userHistory ? (
          <div className="flex flex-col-reverse w-full gap-y-1">
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
