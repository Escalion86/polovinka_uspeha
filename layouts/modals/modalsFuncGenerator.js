// import CheckBox from '@components/CheckBox'
// import Input from '@components/Input'
// import { MODES } from '@helpers/constants'
// import { postData } from '@helpers/CRUD'
// import emailValidator from '@helpers/emailValidator'
// import { useEffect, useState } from 'react'
// import useErrors from '@helpers/useErrors'
// import { modalsFuncAtom } from '@state/atoms'
// import { useRecoilValue } from 'recoil'

import reviewFunc from './modalsFunc/reviewFunc'
import directionFunc from './modalsFunc/directionFunc'
import eventFunc from './modalsFunc/eventFunc'
import userFunc from './modalsFunc/userFunc'
import additionalBlockFunc from './modalsFunc/additionalBlockFunc'

import { deleteData } from '@helpers/CRUD'
import eventSignUpFunc from './modalsFunc/eventSignUpFunc'
import paymentFunc from './modalsFunc/paymentFunc'

const modalsFuncGenerator = (setModals, itemsFunc) => {
  // const modalsFunc = useRecoilValue(modalsFuncAtom)
  const addModal = (props) => setModals((modals) => [...modals, props])

  return {
    add: addModal,
    confirm: ({
      title = 'Отмена изменений',
      text = 'Вы уверены, что хотите закрыть окно без сохранения изменений?',
      onConfirm,
    }) => {
      addModal({
        title,
        text,
        onConfirm,
      })
    },
    custom: ({ title, text, onConfirm, Children }) => {
      addModal({
        title,
        text,
        onConfirm,
        Children,
      })
    },
    review: {
      add: (reviewId) => addModal(reviewFunc(reviewId, true)),
      edit: (reviewId) => addModal(reviewFunc(reviewId)),
      delete: (reviewId) =>
        addModal({
          title: 'Удаление отзыва',
          text: 'Вы уверены, что хотите удалить отзыв?',
          onConfirm: async () => itemsFunc.review.delete(reviewId),
        }),
    },
    direction: {
      add: (directionId) => addModal(directionFunc(directionId, true)),
      edit: (directionId) => addModal(directionFunc(directionId)),
      delete: (directionId) =>
        addModal({
          title: 'Удаление направления',
          text: 'Вы уверены, что хотите удалить направление?',
          onConfirm: async () => itemsFunc.direction.delete(directionId),
        }),
    },
    event: {
      add: (eventId) => addModal(eventFunc(eventId, true)),
      edit: (eventId) => addModal(eventFunc(eventId)),
      delete: (eventId) =>
        addModal({
          title: 'Удаление события',
          text: 'Вы уверены, что хотите удалить событие?',
          onConfirm: async () => itemsFunc.event.delete(eventId),
        }),
      signUp: (eventId) => addModal(eventSignUpFunc(eventId)),
    },
    payment: {
      add: (paymentId) => addModal(paymentFunc(paymentId, true)),
      edit: (paymentId) => addModal(paymentFunc(paymentId)),
      delete: (paymentId) =>
        addModal({
          title: 'Удаление транзакции',
          text: 'Вы уверены, что хотите удалить транзакцию?',
          onConfirm: async () => itemsFunc.payment.delete(paymentId),
        }),
    },
    user: {
      add: (userId) => addModal(userFunc(userId, true)),
      edit: (userId) => addModal(userFunc(userId)),
      delete: (userId) =>
        addModal({
          title: 'Удаление пользователя',
          text: 'Вы уверены, что хотите удалить пользователя?',
          onConfirm: async () => itemsFunc.user.delete(userId),
        }),
    },
    additionalBlock: {
      add: (additionalBlockId) =>
        addModal(additionalBlockFunc(additionalBlockId, true)),
      edit: (additionalBlockId) =>
        addModal(additionalBlockFunc(additionalBlockId)),
      delete: (additionalBlockId) =>
        addModal({
          title: 'Удаление дополнительного блока',
          text: 'Вы уверены, что хотите удалить дополнительный блок?',
          onConfirm: async () =>
            itemsFunc.additionalBlock.delete(additionalBlockId),
        }),
    },
  }
}

export default modalsFuncGenerator
