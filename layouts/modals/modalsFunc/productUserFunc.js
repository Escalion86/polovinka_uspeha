import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Textarea from '@components/Textarea'
import { SelectProduct, SelectUser } from '@components/SelectItem'
import { DEFAULT_PRODUCT_USER } from '@helpers/constants'
import useErrors from '@helpers/useErrors'
import itemsFuncAtom from '@state/itemsFuncAtom'
import productsUsersSelector from '@state/selectors/productsUsersSelector'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'

const productUserFunc = (productUserId, clone = false, props) => {
  const ProductUserModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setOnlyCloseButtonShow,
  }) => {
    const productUser = useAtomValue(productsUsersSelector(productUserId))
    const setProductUser = useAtomValue(itemsFuncAtom).productsUser.set

    const [userId, setUserId] = useState(
      props?.userId ?? productUser?.userId ?? DEFAULT_PRODUCT_USER.userId
    )
    const [productId, setProductId] = useState(
      props?.productId ??
        productUser?.productId ??
        DEFAULT_PRODUCT_USER.productId
    )
    const [comment, setComment] = useState(
      props?.comment ?? productUser?.comment ?? DEFAULT_PRODUCT_USER.comment
    )

    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    const onClickConfirm = async () => {
      const toCheck = {
        productId,
        userId,
      }
      if (!checkErrors(toCheck)) {
        closeModal()
        setProductUser(
          {
            _id: productUser?._id,
            userId,
            productId,
            comment: comment.trim(),
          },
          clone
        )
      }
    }

    useEffect(() => {
      const isFormChanged =
        (props?.userId ?? productUser?.userId) !== userId ||
        (props?.productId ?? productUser?.productId) !== productId ||
        (props?.comment ?? productUser?.comment ?? DEFAULT_PRODUCT_USER.comment) !==
          comment

      setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      // if (isEventClosed) setOnlyCloseButtonShow(true)
    }, [userId, productId, comment])

    return (
      <FormWrapper>
        <SelectProduct
          label="Товар"
          selectedId={productId}
          onChange={(id) => {
            removeError('productId')
            setProductId(id)
          }}
          // onDelete={(e) => console.log('e', e)}
          required
          // readOnly={isEventClosed}
          error={errors.productId}
        />
        <SelectUser
          label="Покупатель"
          selectedId={userId}
          onChange={(id) => {
            removeError('userId')
            setUserId(id)
          }}
          // onDelete={(e) => console.log('e', e)}
          required
          // readOnly={isEventClosed}
          error={errors.userId}
        />
        {/* Анкеты у товаров отсутствуют */}
        <Textarea
          label="Комментарий"
          value={comment}
          onChange={setComment}
          rows={3}
        />
        {/* <SelectEvent
          label="Мероприятие"
          selectedId={eventId}
          onChange={isEventClosed ? null : (eventId) => setEventId(eventId)}
          // required
          showEventUsersButton
          showPaymentsButton
          showEditButton
          clearButton={!isEventClosed}
          // readOnly={isEventClosed}
        /> */}
        {/* <DateTimePicker
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
        /> */}

        <ErrorsList errors={errors} />
      </FormWrapper>
    )
  }

  return {
    title: `${
      productUserId && !clone ? 'Редактирование' : 'Создание'
    } заявки на товар`,
    confirmButtonName: productUserId && !clone ? 'Применить' : 'Создать',
    Children: ProductUserModal,
  }
}

export default productUserFunc
