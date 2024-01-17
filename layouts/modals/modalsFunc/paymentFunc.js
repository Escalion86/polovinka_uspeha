import CardButtons from '@components/CardButtons'
import DateTimePicker from '@components/DateTimePicker'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import PriceInput from '@components/PriceInput'
import { SelectEvent, SelectService, SelectUser } from '@components/SelectItem'
import PayDirectionPicker from '@components/ValuePicker/PayDirectionPicker'
import PayTypePicker from '@components/ValuePicker/PayTypePicker'
import SectorPicker from '@components/ValuePicker/SectorPicker'
import { P } from '@components/tags'
import { DEFAULT_PAYMENT } from '@helpers/constants'
import isEventClosedFunc from '@helpers/isEventClosed'
import useErrors from '@helpers/useErrors'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import eventSelector from '@state/selectors/eventSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import paymentSelector from '@state/selectors/paymentSelector'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

const paymentFunc = (paymentId, clone = false, props = {}) => {
  const PaymentModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setOnlyCloseButtonShow,
    setTopLeftComponent,
  }) => {
    const payment = useRecoilValue(paymentSelector(paymentId))
    const setPayment = useRecoilValue(itemsFuncAtom).payment.set

    const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
    const isLoggedUserDev = loggedUserActiveRole?.dev

    const event = useRecoilValue(eventSelector(payment.eventId))
    const isEventClosed = isEventClosedFunc(event)

    const {
      fixedSector,
      fixedUserId,
      fixedProductId,
      fixedEventId,
      fixedServiceId,
      fixedPayDirection,
    } = props

    const defaultSector =
      props?.sector ??
      payment?.sector ??
      (props?.eventId ?? payment?.eventId
        ? 'event'
        : props?.serviceId ?? payment?.serviceId
        ? 'service'
        : props?.productId ?? payment?.productId
        ? 'product'
        : DEFAULT_PAYMENT.sector)

    const [sector, setSector] = useState(defaultSector)

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
    const [serviceId, setServiceId] = useState(
      props?.serviceId ?? payment?.serviceId ?? DEFAULT_PAYMENT.serviceId
    )
    const [productId, setProductId] = useState(
      props?.productId ?? payment?.productId ?? DEFAULT_PAYMENT.productId
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
      const toCheck = {
        payDirection,
        // eventId,
        sector,
        sum,
        payType,
      }
      if (payDirection === 'toUser' || payDirection === 'fromUser')
        toCheck.userId = userId
      if (!checkErrors(toCheck)) {
        closeModal()
        setPayment(
          {
            _id: payment?._id,
            sector,
            payDirection,
            userId:
              payDirection === 'toUser' || payDirection === 'fromUser'
                ? userId
                : null,
            eventId: sector === 'event' ? eventId : null,
            serviceId: sector === 'service' ? serviceId : null,
            productId: sector === 'product' ? productId : null,
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

    // const isUserInEvent = useMemo(
    //   () =>
    //     userId &&
    //     eventId &&
    //     eventsUsers.find(
    //       (eventUser) =>
    //         eventUser.userId === userId && eventUser.eventId === eventId
    //     ),
    //   [userId, eventId, eventsUsers]
    // )

    useEffect(() => {
      const isFormChanged =
        defaultSector !== sector ||
        (props?.payDirection ??
          payment?.payDirection ??
          DEFAULT_PAYMENT.payDirection) !== payDirection ||
        (props?.userId ?? payment?.userId ?? DEFAULT_PAYMENT.userId) !==
          userId ||
        (props?.eventId ?? payment?.eventId ?? DEFAULT_PAYMENT.eventId) !==
          eventId ||
        (props?.serviceId ??
          payment?.serviceId ??
          DEFAULT_PAYMENT.serviceId) !== serviceId ||
        (props?.productId ??
          payment?.productId ??
          DEFAULT_PAYMENT.productId) !== productId ||
        (props?.sum ?? payment?.sum ?? DEFAULT_PAYMENT.sum) !== sum ||
        (props?.status ?? payment?.status ?? DEFAULT_PAYMENT.status) !==
          status ||
        defaultPayAt !== payAt ||
        (props?.payType ?? payment?.payType ?? DEFAULT_PAYMENT.payType) !==
          payType ||
        (props?.comment ?? payment?.comment ?? DEFAULT_PAYMENT.comment) !==
          comment

      setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      setOnlyCloseButtonShow(isEventClosed || !isFormChanged)
    }, [
      sector,
      payDirection,
      userId,
      eventId,
      serviceId,
      productId,
      sum,
      status,
      payAt,
      payType,
      comment,
    ])

    useEffect(() => {
      if (setTopLeftComponent)
        setTopLeftComponent(() => (
          <CardButtons
            item={payment}
            typeOfItem="payment"
            forForm
            showEditButton={false}
            showDeleteButton={false}
          />
        ))
    }, [setTopLeftComponent])

    return (
      <FormWrapper>
        {isEventClosed && (
          <P className="text-danger">
            Мероприятие к которой относится эта транзакция закрыто, поэтому
            редактирование/удаление ее запрещено
          </P>
        )}
        <SectorPicker
          sector={sector}
          onChange={(value) => {
            removeError('sector')
            setSector(value)
            setPayDirection(null)
          }}
          required
          error={errors.sector}
          disabledValues={isLoggedUserDev ? undefined : ['product', 'service']}
          readOnly={isEventClosed || fixedSector}
        />
        <PayDirectionPicker
          payDirection={payDirection}
          onChange={(value) => {
            removeError('payDirection')
            setPayDirection(value)
          }}
          required
          error={errors.payDirection}
          readOnly={isEventClosed || fixedPayDirection}
          sector={sector}
        />
        {sector &&
          (payDirection === 'toUser' || payDirection === 'fromUser') && (
            <SelectUser
              label={payDirection === 'toUser' ? 'Получатель' : 'Платильщик'}
              selectedId={userId}
              onChange={isEventClosed ? null : (userId) => setUserId(userId)}
              // onDelete={(e) => console.log('e', e)}
              required
              // readOnly={isEventClosed}
              readOnly={fixedUserId}
              filter={
                sector === 'internal'
                  ? {
                      role: {
                        value: ['dev', 'admin', 'moder'],
                        operand: 'includes',
                      },
                    }
                  : undefined
              }
            />
          )}
        {sector === 'event' && (
          <SelectEvent
            label="Мероприятие"
            selectedId={eventId}
            onChange={isEventClosed ? null : (eventId) => setEventId(eventId)}
            // required
            showEventUsersButton
            showPaymentsButton
            showEditButton
            clearButton={!isEventClosed && !fixedEventId}
            // readOnly={isEventClosed}
            readOnly={fixedEventId}
          />
        )}
        {sector === 'service' && (
          <SelectService
            label="Услуга"
            selectedId={serviceId}
            onChange={setServiceId}
            // required
            showEventUsersButton
            showPaymentsButton
            showEditButton
            clearButton={true}
            // readOnly={isEventClosed}
            readOnly={fixedServiceId}
          />
        )}
        <DateTimePicker
          value={payAt}
          onChange={(date) => {
            removeError('payAt')
            setPayAt(date)
          }}
          label="Дата проведения"
          required
          error={errors.payAt}
          disabled={isEventClosed}
          className="w-52"
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
