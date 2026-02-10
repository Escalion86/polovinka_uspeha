import Textarea from '@components/Textarea'
import itemsFuncAtom from '@state/itemsFuncAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'

const productApplyFunc = (productId) => {
  const ProductApplyModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const loggedUserActive = useAtomValue(loggedUserActiveAtom)
    const itemsFunc = useAtomValue(itemsFuncAtom)

    const [comment, setComment] = useState('')

    const onClickConfirm = async () => {
      closeModal()
      itemsFunc.productsUser.set(
        {
          productId,
          userId: loggedUserActive?._id,
          comment: comment.trim(),
        }
        // (data) => {
        // if (data.error === 'мероприятие закрыто') {
        //   fixEventStatus(eventId, 'closed')
        // }
        // if (data.error === 'мероприятие отменено') {
        //   fixEventStatus(eventId, 'canceled')
        // }
        // if (data.solution === 'reserve') {
        //   eventSignUpToReserveAfterError(eventId, data.error)
        // }
        // }
      )
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
    }, [])

    return (
      <div className="flex flex-col gap-y-2">
        <div>{'Вы уверены что хотите оставить заявку на товар?'}</div>
        <Textarea
          label="Комментарий"
          value={comment}
          onChange={setComment}
          rows={3}
        />
      </div>
    )
  }

  // const postfixStatus = status === 'reserve' ? ' в резерв' : ''

  return {
    title: `Заявка на товар`,
    // text: `Для подачи заявки на услугу необходимо заполнить анкету`,
    confirmButtonName: `Отправить заявку`,
    Children: ProductApplyModal,
  }
}

export default productApplyFunc
