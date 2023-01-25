import React, { useEffect, useMemo, useState } from 'react'
import useErrors from '@helpers/useErrors'
import { useRecoilValue } from 'recoil'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import eventSelector from '@state/selectors/eventSelector'

import FormWrapper from '@components/FormWrapper'
import ErrorsList from '@components/ErrorsList'
import { SelectEvent } from '@components/SelectItem'
import PayTypePicker from '@components/ValuePicker/PayTypePicker'
import DateTimePicker from '@components/DateTimePicker'
import CheckBox from '@components/CheckBox'

const paymentsAutoFillFunc = (eventId) => {
  const PaymentsAutoFillModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setOnlyCloseButtonShow,
  }) => {
    // const payment = useRecoilValue(paymentSelector(paymentId))
    const autofillPayments =
      useRecoilValue(itemsFuncAtom).payment.autofillPayments

    const event = useRecoilValue(eventSelector(eventId))
    // const isEventClosed = isEventClosedFunc(event)

    // const [payDirection, setPayDirection] = useState(
    //   props?.payDirection ??
    //     payment?.payDirection ??
    //     DEFAULT_PAYMENT.payDirection
    // )
    // const [userId, setUserId] = useState(
    //   props?.userId ?? payment?.userId ?? DEFAULT_PAYMENT.userId
    // )
    // const [eventId, setEventId] = useState(
    //   props?.eventId ?? payment?.eventId ?? DEFAULT_PAYMENT.eventId
    // )
    // const [sum, setSum] = useState(
    //   props?.sum ?? payment?.sum ?? DEFAULT_PAYMENT.sum
    // )
    // const [status, setStatus] = useState(
    //   props?.status ?? payment?.status ?? DEFAULT_PAYMENT.status
    // )
    const defaultPayAt = useMemo(() => event?.dateStart ?? Date.now(), [])
    const [payAt, setPayAt] = useState(defaultPayAt)
    const [payType, setPayType] = useState(null)
    const [couponForOrganizer, setCouponForOrganizer] = useState(true)
    // const [comment, setComment] = useState(
    //   props?.comment ?? payment?.comment ?? DEFAULT_PAYMENT.comment
    // )

    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    const onClickConfirm = async () => {
      if (!checkErrors({ payType, payAt })) {
        closeModal()
        autofillPayments({
          eventId,
          payType,
          payAt,
          couponForOrganizer,
        })
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
      const isFormChanged = defaultPayAt !== payAt || payType !== null

      setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      // if (isEventClosed) setOnlyCloseButtonShow(true)
    }, [payAt, payType])

    return (
      <FormWrapper>
        {/* {isEventClosed && (
          <P className="text-danger">
            Мероприятие к которой относится эта транзакция закрыто, поэтому
            редактирование ее запрещено
          </P>
        )} */}
        {/* <PayDirectionPicker
          payDirection="fromUser"
          // onChange={(value) => {
          //   removeError('payDirection')
          //   setPayDirection(value)
          // }}
          required
          // error={errors.payDirection}
          readOnly
        /> */}
        {/* <SelectUser
          label='Платильщик'
          selectedId={userId}
          onChange={(userId) => setUserId(userId)}
          // onDelete={(e) => console.log('e', e)}
          required
          readOnly
          /> */}
        <SelectEvent
          label="Мероприятие"
          selectedId={eventId}
          // onChange={(eventId) => setEventId(eventId)}
          required
          readOnly
        />
        <DateTimePicker
          value={payAt}
          onChange={(date) => {
            removeError('payAt')
            setPayAt(date)
          }}
          label="Дата проведения транзакций"
          required
          error={errors.payAt}
          // disabled={isEventClosed}
        />
        {/* <PriceInput
          label="Сумма"
          value={sum}
          onChange={(value) => {
            removeError('sum')
            setSum(value)
          }}
          disabled={isEventClosed}
        /> */}
        <PayTypePicker
          label="Тип оплаты для всех транзакций"
          payType={payType}
          onChange={(value) => {
            removeError('payType')
            setPayType(value)
          }}
          required
          error={errors.payType}
          // readOnly={isEventClosed}
        />
        <CheckBox
          checked={couponForOrganizer}
          labelPos="left"
          onClick={() => setCouponForOrganizer((state) => !state)}
          // labelClassName="w-[20%]"
          label="Если среди участиков есть организатор, то поставить ему купон"
        />
        {/* <Input
          label="Комментарий"
          type="text"
          value={comment}
          onChange={setComment}
          disabled={isEventClosed}
        /> */}
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
    title: `Автозаполнение транзакций от участников в мероприятии`,
    confirmButtonName: 'Автоматически заполнить',
    Children: PaymentsAutoFillModal,
  }
}

export default paymentsAutoFillFunc
