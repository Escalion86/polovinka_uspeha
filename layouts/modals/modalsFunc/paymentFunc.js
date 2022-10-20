import React, { useEffect, useState } from 'react'
import useErrors from '@helpers/useErrors'

import { useRecoilValue } from 'recoil'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import paymentSelector from '@state/selectors/paymentSelector'

import FormWrapper from '@components/FormWrapper'
import ErrorsList from '@components/ErrorsList'
import { SelectEvent, SelectUser } from '@components/SelectItem'
import PriceInput from '@components/PriceInput'
import PayTypePicker from '@components/ValuePicker/PayTypePicker'
import { DEFAULT_PAYMENT } from '@helpers/constants'
import DateTimePicker from '@components/DateTimePicker'

const paymentFunc = (paymentId, clone = false) => {
  const PaymentModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const payment = useRecoilValue(paymentSelector(paymentId))
    const setPayment = useRecoilValue(itemsFuncAtom).payment.set

    const [userId, setUserId] = useState(
      payment?.userId ?? DEFAULT_PAYMENT.userId
    )
    const [eventId, setEventId] = useState(
      payment?.eventId ?? DEFAULT_PAYMENT.eventId
    )
    const [sum, setSum] = useState(payment?.sum ?? DEFAULT_PAYMENT.sum)
    const [status, setStatus] = useState(
      payment?.status ?? DEFAULT_PAYMENT.status
    )
    const [payAt, setPayAt] = useState(payment?.payAt ?? Date.now())
    const [payType, setPayType] = useState(
      payment?.payType ?? DEFAULT_PAYMENT.payType
    )

    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    const onClickConfirm = async () => {
      if (!checkErrors({ userId, eventId, sum })) {
        closeModal()
        setPayment(
          {
            _id: payment?._id,
            userId,
            eventId,
            sum,
            status,
            payType,
            payAt,
          },
          clone
        )
        // if (direction && !clone) {
        //   await putData(
        //     `/api/directions/${direction._id}`,
        //     {
        //       title,
        //       description,
        //       showOnSite,
        //       image,
        //     },
        //     refreshPage
        //   )
        // } else {
        //   await postData(
        //     `/api/directions`,
        //     {
        //       title,
        //       description,
        //       showOnSite,
        //       image,
        //     },
        //     refreshPage
        //   )
        // }
      }
    }

    useEffect(() => {
      const isFormChanged =
        payment?.userId !== userId ||
        payment?.eventId !== eventId ||
        payment?.sum !== sum ||
        payment?.status !== status ||
        payment?.payAt !== payAt ||
        payment?.payType !== payType

      setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
    }, [userId, eventId, sum, status, payAt, payType])

    return (
      <FormWrapper>
        <SelectUser
          label="Платильщик"
          selectedId={userId}
          onChange={(userId) => setUserId(userId)}
          // onDelete={(e) => console.log('e', e)}
          required
        />
        <SelectEvent
          label="Мероприятие"
          selectedId={eventId}
          onChange={(eventId) => setEventId(eventId)}
          required
        />
        <DateTimePicker
          value={payAt}
          onChange={(date) => {
            removeError('payAt')
            setPayAt(date)
          }}
          label="Дата проведения"
          required
          error={errors.payAt}
        />
        <PriceInput
          value={sum}
          onChange={(value) => {
            removeError('sum')
            setSum(value)
          }}
        />
        <PayTypePicker payType={payType} onChange={setPayType} required />
        {/* <Input
          label="Сумма"
          type="number"
          value={sum}
          onChange={(value) => {
            removeError('sum')
            setSum(value)
          }}
          // labelClassName="w-40"
          error={errors.sum}
        /> */}
        {/* <CheckBox
          checked={showOnSite}
          labelPos="left"
          // labelClassName="w-40"
          onClick={() => setShowOnSite((checked) => !checked)}
          label="Показывать на сайте"
        /> */}
        <ErrorsList errors={errors} />
      </FormWrapper>
    )
  }

  return {
    title: `${paymentId && !clone ? 'Редактирование' : 'Создание'} транзакции`,
    confirmButtonName: paymentId && !clone ? 'Применить' : 'Создать',
    Children: PaymentModal,
  }
}

export default paymentFunc
