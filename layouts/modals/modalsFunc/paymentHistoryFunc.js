import HistoryItem from '@components/HistoryItem'
import LoadingSpinner from '@components/LoadingSpinner'
import { getData } from '@helpers/CRUD'
import compareObjectsWithDif from '@helpers/compareObjectsWithDif'
import paymentSelector from '@state/selectors/paymentSelector'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import PaymentKeyValueItem from './historyKeyValuesItems/PaymentKeyValueItem'
import { paymentKeys } from './historyKeyValuesItems/keys'

const paymentHistoryFunc = (paymentId) => {
  const PaymentHistoryModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const payment = useAtomValue(paymentSelector(paymentId))
    const [paymentHistory, setPaymentHistory] = useState()

    if (!payment || !paymentId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Транзакция не найдена!
        </div>
      )

    useEffect(() => {
      const fetchData = async () => {
        const result = await getData(`/api/histories`, {
          schema: 'payments',
          'data._id': paymentId,
        })
        setPaymentHistory(result)
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
        {paymentHistory ? (
          <div className="flex flex-col-reverse w-full gap-y-1">
            {paymentHistory.length === 0
              ? 'Нет записей'
              : paymentHistory.map(
                  (
                    { action, data, userId, createdAt, _id, difference },
                    index
                  ) => {
                    const changes = difference
                      ? data[0]
                      : compareObjectsWithDif(
                          index > 0 ? paymentHistory[index - 1].data[0] : {},
                          data[0]
                        )

                    return (
                      <HistoryItem
                        key={_id}
                        action={action}
                        changes={changes}
                        createdAt={createdAt}
                        userId={userId}
                        KeyValueItem={PaymentKeyValueItem}
                        keys={paymentKeys}
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
    title: `История изменений транзакции`,
    Children: PaymentHistoryModal,
    declineButtonName: 'Закрыть',
    showDecline: true,
  }
}

export default paymentHistoryFunc
