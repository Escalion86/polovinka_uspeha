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
import selectDirectionsFunc from './modalsFunc/selectDirectionsFunc'
import selectEventsFunc from './modalsFunc/selectEventsFunc'
import jsonFunc from './modalsFunc/jsonFunc'
import cropImageFunc from './modalsFunc/cropImageFunc'
import userVisitedEventsFunc from './modalsFunc/userVisitedEventsFunc'
import notificationsTelegramFunc from './modalsFunc/notificationsTelegramFunc'
import userQuestionnaireFunc from './modalsFunc/userQuestionnaireFunc'
import questionnaireFunc from './modalsFunc/questionnaireFunc'
import userSignedUpEventsFunc from './modalsFunc/userSignedUpEventsFunc'
import userDeleteFunc from './modalsFunc/userDeleteFunc'

const modalsFuncGenerator = (setModals, itemsFunc, router, loggedUser) => {
  // const modalsFunc = useRecoilValue(modalsFuncAtom)
  const addModal = (props) => {
    setModals((modals) => {
      const maxId =
        modals.length > 0
          ? Math.max.apply(
              null,
              modals.map((modal) => modal.id)
            )
          : -1

      if (props.uid && modals.find((modal) => modal.props.uid === props.uid))
        return modals

      return [...modals, { id: maxId < 0 ? 0 : maxId + 1, props }]
    })
  }

  return {
    add: addModal,
    confirm: ({
      title = 'Отмена изменений',
      text = 'Вы уверены, что хотите закрыть окно без сохранения изменений?',
      onConfirm,
    }) =>
      addModal({
        title,
        text,
        onConfirm,
      }),
    minimalSize: () =>
      addModal({
        title: 'Маленький размер фотографии',
        text: 'Фотография слишком маленькая. Размер должен быть не менее 100x100',
        confirmButtonName: `Понятно`,
        showConfirm: true,
        showDecline: false,
      }),
    custom: addModal,
    cropImage: (...data) => addModal(cropImageFunc(...data)),
    error: (data) => addModal(errorFunc(data)),
    json: (data) => addModal(jsonFunc(data)),
    selectEvents: (
      itemsId,
      filterRules,
      onChange,
      exceptedIds,
      maxEvents,
      canSelectNone,
      modalTitle
    ) =>
      addModal(
        selectEventsFunc(
          itemsId,
          filterRules,
          onChange,
          exceptedIds,
          maxEvents,
          canSelectNone,
          modalTitle
        )
      ),
    selectUsers: (
      itemsId,
      filterRules,
      onChange,
      exceptedIds,
      maxUsers,
      canSelectNone,
      modalTitle
    ) =>
      addModal(
        selectUsersFunc(
          itemsId,
          filterRules,
          onChange,
          exceptedIds,
          maxUsers,
          canSelectNone,
          modalTitle
        )
      ),
    selectDirections: (
      itemsId,
      filterRules,
      onChange,
      exceptedIds,
      maxDirections,
      canSelectNone,
      modalTitle
    ) =>
      addModal(
        selectDirectionsFunc(
          itemsId,
          filterRules,
          onChange,
          exceptedIds,
          maxDirections,
          canSelectNone,
          modalTitle
        )
      ),
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
      signUp: (eventId, status) => {
        if (!loggedUser?._id)
          addModal({
            title: 'Необходимо зарегистрироваться и авторизироваться',
            text: 'Для записи на мероприятие, необходимо сначала зарегистрироваться, а затем авторизироваться на сайте',
            confirmButtonName: 'Зарегистрироваться / Авторизироваться',
            onConfirm: () => router.push('/login', '', { shallow: true }),
          })
        else {
          const postfixStatus = status === 'reserve' ? ' в резерв' : ''
          addModal({
            title: `Запись${postfixStatus} на мероприятие`,
            text: `Вы уверены что хотите записаться${postfixStatus} на мероприятие?`,
            confirmButtonName: `Записаться${postfixStatus}`,
            onConfirm: () => {
              itemsFunc.event.signUp(eventId, loggedUser?._id, status)
            },
          })
        }
      },
      signOut: (eventId, activeStatus) => {
        if (!loggedUser?._id)
          addModal({
            title: 'Необходимо зарегистрироваться',
            text: 'Для записи на мероприятие, необходимо сначала авторизироваться на сайте',
            confirmButtonName: 'Авторизироваться',
            onConfirm: () => router.push('/login', '', { shallow: true }),
          })
        else {
          const postfixStatus = activeStatus === 'reserve' ? ' в резерв' : ''
          addModal({
            title: `Отмена записи${postfixStatus} на мероприятие`,
            text: `Вы уверены что хотите отменить запись${postfixStatus} на мероприятие?`,
            confirmButtonName: `Отменить запись${postfixStatus}`,
            onConfirm: () => {
              itemsFunc.event.signOut(eventId, loggedUser?._id, activeStatus)
            },
          })
        }
      },
      cantSignUp: () =>
        addModal({
          title: 'Запись на мероприятие невозможна',
          text: 'Ваша учетная запись заблокирована, поэтому вы не можете записываться на мероприятия. Пожалуйста обратитесь к администратору.',
          confirmButtonName: `Понятно`,
          showConfirm: true,
          showDecline: false,
        }),
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
        addModal(
          userDeleteFunc(userId)
          //   {
          //   title: 'Удаление пользователя',
          //   text: 'Вы уверены, что хотите удалить пользователя?',
          //   onConfirm: async () => itemsFunc.user.delete(userId),
          // }
        ),
      view: (userId) => addModal(userViewFunc(userId)),
      events: (userId) => addModal(userSignedUpEventsFunc(userId)),
      questionnaire: (userId, questionnaireId) =>
        addModal(userQuestionnaireFunc(userId, questionnaireId)),
    },
    questionnaire: {
      add: (questionnaireId) =>
        addModal(questionnaireFunc(questionnaireId, true)),
      edit: (questionnaireId) => addModal(questionnaireFunc(questionnaireId)),
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
    notifications: {
      telegram: () => addModal(notificationsTelegramFunc()),
    },
  }
}

export default modalsFuncGenerator
