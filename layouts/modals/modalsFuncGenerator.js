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
import eventUsersFunc from './modalsFunc/eventUsersFunc'
import userFunc from './modalsFunc/userFunc'
import additionalBlockFunc from './modalsFunc/additionalBlockFunc'

import eventViewFunc from './modalsFunc/eventViewFunc'
import paymentFunc from './modalsFunc/paymentFunc'
import userViewFunc from './modalsFunc/userViewFunc'
import errorFunc from './modalsFunc/errorFunc'
import selectUsersFunc from './modalsFunc/selectUsersFunc'
import selectDirectionFunc from './modalsFunc/selectDirectionFunc'
import jsonFunc from './modalsFunc/jsonFunc'

const modalsFuncGenerator = (setModals, itemsFunc, router, loggedUser) => {
  // const modalsFunc = useRecoilValue(modalsFuncAtom)
  const addModal = (props) =>
    setModals((modals) => {
      const maxId =
        modals.length > 0
          ? Math.max.apply(
              null,
              modals.map((modal) => modal.id)
            )
          : -1
      // if (props.id && modals.find((modal) => modal.id === props.id))
      //   return modals
      return [...modals, { id: maxId + 1, props }]
    })

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
    custom: addModal,
    error: (data) => addModal(errorFunc(data)),
    json: (data) => addModal(jsonFunc(data)),
    selectUsers: (itemsId, filter, onChange, exceptedIds, maxUsers) =>
      addModal(
        selectUsersFunc(itemsId, filter, onChange, exceptedIds, maxUsers)
      ),
    selectDirection: (itemsId, filter, onChange, exceptedIds) =>
      addModal(selectDirectionFunc(itemsId, filter, onChange, exceptedIds)),
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
      users: (eventId) => addModal(eventUsersFunc(eventId)),
      cancel: (eventId) =>
        addModal({
          title: 'Отмена события',
          text: 'Вы уверены, что хотите отменить событие (это не удалит событие, а лишь изменит его статус на отмененное)?',
          onConfirm: async () => itemsFunc.event.cancel(eventId),
        }),
      uncancel: (eventId) =>
        addModal({
          title: 'Возобновление события',
          text: 'Вы уверены, что хотите возобновить событие?',
          onConfirm: async () => itemsFunc.event.uncancel(eventId),
        }),
      delete: (eventId) =>
        addModal({
          title: 'Удаление события',
          text: 'Вы уверены, что хотите удалить событие?',
          onConfirm: async () => itemsFunc.event.delete(eventId),
        }),
      view: (eventId) => addModal(eventViewFunc(eventId)),
      signUp: (eventId) => {
        if (!loggedUser?._id)
          addModal({
            title: 'Необходимо зарегистрироваться и авторизироваться',
            text: 'Для записи на мероприятие, необходимо сначала зарегистрироваться, а затем авторизироваться на сайте',
            confirmButtonName: 'Зарегистрироваться / Авторизироваться',
            onConfirm: () => router.push('/login'),
          })
        else
          addModal({
            title: 'Запись на мероприятие',
            text: 'Вы уверены что хотите записаться на мероприятие?',
            confirmButtonName: 'Записаться',
            onConfirm: () => {
              itemsFunc.event.signUp(eventId, loggedUser._id)
            },
          })
      },
      signOut: (eventId) => {
        if (!loggedUser?._id)
          addModal({
            title: 'Необходимо зарегистрироваться',
            text: 'Для записи на мероприятие, необходимо сначала авторизироваться на сайте',
            confirmButtonName: 'Авторизироваться',
            onConfirm: () => router.push('/login'),
          })
        else
          addModal({
            title: 'Отмена записии на мероприятие',
            text: 'Вы уверены что хотите отменить запись на мероприятие?',
            confirmButtonName: 'Отменить запись',
            onConfirm: () => {
              itemsFunc.event.signOut(eventId, loggedUser._id)
            },
          })
      },
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
      view: (userId) => addModal(userViewFunc(userId)),
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
