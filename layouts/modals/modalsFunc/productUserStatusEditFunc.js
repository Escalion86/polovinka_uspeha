import DateTimePicker from '@components/DateTimePicker'
import ProductUserStatusPicker from '@components/ValuePicker/ProductUserStatusPicker'
import { DEFAULT_PRODUCT_USER } from '@helpers/constants'
import itemsFuncAtom from '@state/itemsFuncAtom'
import productsUsersSelector from '@state/selectors/productsUsersSelector'
import { useEffect, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'

const productUserStatusEditFunc = (productUserId) => {
  const ProductUserStatusEditModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const productUser = useAtomValue(productsUsersSelector(productUserId))
    const setProductUser = useAtomValue(itemsFuncAtom).productsUser.set
    // const isEventExpired = isEventExpiredFunc(event)

    // const totalIncome = useAtomValue(totalIncomeOfEventSelector(eventId))
    // const expectedIncome = useAtomValue(
    //   expectedIncomeOfEventSelector(eventId)
    // )
    // const canSetClosed = totalIncome >= expectedIncome && isEventExpired

    const [status, setStatus] = useState(
      productUser?.status ?? DEFAULT_PRODUCT_USER.status
    )

    const defaultCloseDate = useMemo(
      () => productUser?.closeDate ?? Date.now(),
      []
    )

    const [closeDate, setCloseDate] = useState(defaultCloseDate)

    if (!productUser || !productUserId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Заявка не найдена!
        </div>
      )

    const onClickConfirm = async () => {
      closeModal()
      setProductUser({
        _id: productUser?._id,
        status,
        closeDate,
      })
    }

    useEffect(() => {
      const isFormChanged =
        productUser?.status !== status || closeDate !== defaultCloseDate
      setDisableConfirm(!isFormChanged)
      setOnConfirmFunc(onClickConfirm)
    }, [status, closeDate])

    return (
      <div className="flex flex-col gap-y-2">
        <ProductUserStatusPicker
          required
          status={status}
          onChange={setStatus}
          // disabledValues={canSetClosed ? [] : ['closed']}
        />
        {status === 'closed' && (
          <DateTimePicker
            value={closeDate}
            onChange={(date) => {
              // removeError('closeDate')
              setCloseDate(date)
            }}
            label="Дата закрытия"
            required
            // error={errors.closeDate}
            // postfix={formatMinutes(duration)}
          />
        )}
        {/* {!canSetClosed && (
          <>
            <div className="text-red-500">
              Закрытие мероприятия не доступно так как:
            </div>
            <ul className="ml-4 -mt-2 list-disc">
              {totalIncome < expectedIncome && (
                <li className="text-red-500">
                  финансы мероприятия не полностью заполнены
                </li>
              )}
              {!isEventExpired && (
                <li className="text-red-500">мероприятие не завершено</li>
              )}
            </ul>
          </>
        )} */}
      </div>
    )
  }

  return {
    title: `Редактирование статуса заявки`,
    confirmButtonName: 'Применить',
    Children: ProductUserStatusEditModal,
    // TopLeftComponent: () => (
    //   <CardButtons
    //     item={{ _id: eventId }}
    //     typeOfItem="event"
    //     forForm
    //   />
    // ),
  }
}

export default productUserStatusEditFunc
