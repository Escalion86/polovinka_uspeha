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
import isEventClosedFunc from '@helpers/isEventClosed'
import eventSelector from '@state/selectors/eventSelector'
import { P } from '@components/tags'
import eventsUsersAtom from '@state/atoms/eventsUsersAtom'

const paymentFunc = (paymentId, clone = false, props) => {
  const PaymentModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setOnlyCloseButtonShow,
  }) => {
    const payment = useRecoilValue(paymentSelector(paymentId))
    const setPayment = useRecoilValue(itemsFuncAtom).payment.set

    const event = useRecoilValue(eventSelector(payment.eventId))
    const isEventClosed = isEventClosedFunc(event)
    const eventsUsers = useRecoilValue(eventsUsersAtom)

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

    const isUserInEvent = useMemo(
      () =>
        userId &&
        eventId &&
        eventsUsers.find(
          (eventUser) =>
            eventUser.userId === userId && eventUser.eventId === eventId
        ),
      [userId, eventId, eventsUsers]
    )

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
      if (isEventClosed) setOnlyCloseButtonShow(true)
    }, [payDirection, userId, eventId, sum, status, payAt, payType, comment])

    return (
      <FormWrapper>
        {isEventClosed && (
          <P className="text-danger">
            Мероприятие к которой относится эта транзакция закрыто, поэтому
            редактирование/удаление ее запрещено
          </P>
        )}
        {userId && !isUserInEvent && (
          <>
            <div className="text-red-500">
              Пользователь не записан на мероприятие! Для корректности, нужно
              сделать один из вариантов:
            </div>
            <ul className="ml-4 -mt-2 list-disc">
              <li className="text-red-500">удалить данную транзакцию</li>
              <li className="text-red-500">
                записать пользователя на мероприятие
              </li>
              <li className="text-red-500">
                указать другого записанного пользователя
              </li>
            </ul>
          </>
        )}
        <PayDirectionPicker
          payDirection={payDirection}
          onChange={(value) => {
            removeError('payDirection')
            setPayDirection(value)
          }}
          required
          error={errors.payDirection}
          readOnly={isEventClosed}
        />
        {(payDirection === 'toUser' || payDirection === 'fromUser') && (
          <SelectUser
            label={payDirection === 'toUser' ? 'Получатель' : 'Платильщик'}
            selectedId={userId}
            onChange={isEventClosed ? null : (userId) => setUserId(userId)}
            // onDelete={(e) => console.log('e', e)}
            required
            // readOnly={isEventClosed}
          />
        )}
        <SelectEvent
          label="Мероприятие"
          selectedId={eventId}
          onChange={isEventClosed ? null : (eventId) => setEventId(eventId)}
          required
          // readOnly={isEventClosed}
        />
        <DateTimePicker
          value={payAt}
          onChange={(date) => {
            removeError('payAt')
            setPayAt(date)
          }}
          label="Дата проведения транзакции"
          required
          error={errors.payAt}
          disabled={isEventClosed}
        />
        <PriceInput
          label="Сумма"
          value={sum}
          onChange={(value) => {
            removeError('sum')
            setSum(value)
          }}
          disabled={isEventClosed}
        />
        <PayTypePicker
          payType={payType}
          onChange={(value) => {
            removeError('payType')
            setPayType(value)
          }}
          required
          error={errors.payType}
          readOnly={isEventClosed}
        />
        <Input
          label="Комментарий"
          type="text"
          value={comment}
          onChange={setComment}
          disabled={isEventClosed}
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
