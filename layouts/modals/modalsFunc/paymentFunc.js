import React, { useEffect, useMemo, useState } from 'react'
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
import PayDirectionPicker from '@components/ValuePicker/PayDirectionPicker'
import Input from '@components/Input'

const paymentFunc = (paymentId, clone = false, props) => {
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

    const [payDirection, setPayDirection] = useState(
      props?.payDirection ??
        payment?.payDirection ??
        DEFAULT_PAYMENT.payDirection
    )
    const [userId, setUserId] = useState(
      props?.userId ?? payment?.userId ?? DEFAULT_PAYMENT.userId
    )
    const [eventId, setEventId] = useState(
      props?.eventId ?? payment?.eventId ?? DEFAULT_PAYMENT.eventId
    )
    const [sum, setSum] = useState(
      props?.sum ?? payment?.sum ?? DEFAULT_PAYMENT.sum
    )
    const [status, setStatus] = useState(
      props?.status ?? payment?.status ?? DEFAULT_PAYMENT.status
    )
    const defaultPayAt = useMemo(
      () => props?.payAt ?? payment?.payAt ?? Date.now(),
      []
    )
    const [payAt, setPayAt] = useState(defaultPayAt)
    const [payType, setPayType] = useState(
      props?.payType ?? payment?.payType ?? DEFAULT_PAYMENT.payType
    )
    const [comment, setComment] = useState(
      props?.comment ?? payment?.comment ?? DEFAULT_PAYMENT.comment
    )

    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    const onClickConfirm = async () => {
      const toCheck = { payDirection, eventId, sum, payType }
      if (payDirection === 'toUser' || payDirection === 'fromUser')
        toCheck.userId = userId
      if (!checkErrors(toCheck)) {
        closeModal()
        setPayment(
          {
            _id: payment?._id,
            payDirection,
            userId:
              payDirection === 'toUser' || payDirection === 'fromUser'
                ? userId
                : null,
            eventId,
            sum,
            status,
            payType,
            payAt,
            comment,
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
        (props?.payDirection ?? payment?.payDirection) !== payDirection ||
        (props?.userId ?? payment?.userId) !== userId ||
        (props?.eventId ?? payment?.eventId) !== eventId ||
        (props?.sum ?? payment?.sum) !== sum ||
        (props?.status ?? payment?.status) !== status ||
        defaultPayAt !== payAt ||
        (props?.payType ?? payment?.payType) !== payType ||
        (props?.comment ?? payment?.comment) !== comment

      setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
    }, [payDirection, userId, eventId, sum, status, payAt, payType, comment])

    return (
      <FormWrapper>
        <PayDirectionPicker
          payDirection={payDirection}
          onChange={(value) => {
            removeError('payDirection')
            setPayDirection(value)
          }}
          required
          error={errors.payDirection}
        />
        {(payDirection === 'toUser' || payDirection === 'fromUser') && (
          <SelectUser
            label={payDirection === 'toUser' ? 'Получатель' : 'Платильщик'}
            selectedId={userId}
            onChange={(userId) => setUserId(userId)}
            // onDelete={(e) => console.log('e', e)}
            required
          />
        )}
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
          label="Сумма"
          value={sum}
          onChange={(value) => {
            removeError('sum')
            setSum(value)
          }}
        />
        <PayTypePicker
          payType={payType}
          onChange={(value) => {
            removeError('payType')
            setPayType(value)
          }}
          required
          error={errors.payType}
        />
        <Input
          label="Комментарий"
          type="text"
          value={comment}
          onChange={setComment}
        />
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
