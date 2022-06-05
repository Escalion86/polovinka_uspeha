import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import { postData, putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import React, { useEffect, useState } from 'react'
import EditableTextarea from '@components/EditableTextarea'
import { useRouter } from 'next/router'
import FormWrapper from '@components/FormWrapper'
import InputImage from '@components/InputImage'
import ErrorsList from '@components/ErrorsList'
import directionSelector from '@state/selectors/directionSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import { useRecoilValue } from 'recoil'
import paymentSelector from '@state/selectors/paymentSelector'
import { SelectEvent, SelectUser } from '@components/SelectItem'
import PriceInput from '@components/PriceInput'
import PayTypePicker from '@components/ValuePicker/PayTypePicker'

const paymentFunc = (paymentId, clone = false) => {
  const PaymentModal = ({ closeModal, setOnConfirmFunc, setOnDeclineFunc }) => {
    const payment = useRecoilValue(paymentSelector(paymentId))
    const setPayment = useRecoilValue(itemsFuncAtom).payment.set

    const [userId, setUserId] = useState(payment ? payment.userId : null)
    const [eventId, setEventId] = useState(payment ? payment.eventId : null)
    const [sum, setSum] = useState(payment ? payment.sum : 0)
    const [status, setStatus] = useState(payment ? payment.status : '')
    const [payAt, setPayAt] = useState(payment ? payment.payAt : null)
    const [payType, setPayType] = useState(payment ? payment.payType : null)

    const [errors, addError, removeError, clearErrors] = useErrors()

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    const onClickConfirm = async () => {
      let error = false
      if (!userId) {
        addError({ userId: 'Необходимо указать пользователя' })
        error = true
      }
      if (!eventId) {
        addError({ eventId: 'Необходимо указать мероприятие' })
        error = true
      }
      if (!sum) {
        addError({ sum: 'Необходимо указать сумму' })
        error = true
      }
      if (!error) {
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
      setOnConfirmFunc(onClickConfirm)
    }, [userId, eventId, sum, status, payAt, payType])

    return (
      <FormWrapper>
        <SelectUser
          selectedId={userId}
          onChange={(user) => setUserId(user._id)}
          // onDelete={(e) => console.log('e', e)}
        />
        <SelectEvent
          selectedId={eventId}
          onChange={(event) => setEventId(event._id)}
        />
        <PriceInput
          value={sum}
          onChange={(value) => {
            removeError('sum')
            setSum(value)
          }}
        />
        <PayTypePicker payType={payType} onChange={setPayType} />
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
          forGrid
        /> */}
        {/* <CheckBox
          checked={showOnSite}
          labelPos="left"
          // labelClassName="w-40"
          forGrid
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
