import reviewFunc from './modalsFunc/reviewFunc'
import directionFunc from './modalsFunc/directionFunc'
import eventFunc from './modalsFunc/eventFunc'
import eventUsersFunc from './modalsFunc/eventUsersFunc'
import userFunc from './modalsFunc/userFunc'
import additionalBlockFunc from './modalsFunc/additionalBlockFunc'
import serviceFunc from './modalsFunc/serviceFunc'

import eventViewFunc from './modalsFunc/eventViewFunc'
import paymentFunc from './modalsFunc/paymentFunc'
import paymentsAutoFillFunc from './modalsFunc/paymentsAutoFillFunc'
import userViewFunc from './modalsFunc/userViewFunc'
import errorFunc from './modalsFunc/errorFunc'
import selectUsersFunc from './modalsFunc/selectUsersFunc'
import selectDirectionsFunc from './modalsFunc/selectDirectionsFunc'
import selectEventsFunc from './modalsFunc/selectEventsFunc'
import jsonFunc from './modalsFunc/jsonFunc'
import cropImageFunc from './modalsFunc/cropImageFunc'
import notificationsTelegramFunc from './modalsFunc/notificationsTelegramFunc'
import userQuestionnaireFunc from './modalsFunc/userQuestionnaireFunc'
import questionnaireConstructorFunc from './modalsFunc/questionnaireConstructorFunc'
import userSignedUpEventsFunc from './modalsFunc/userSignedUpEventsFunc'
import userDeleteFunc from './modalsFunc/userDeleteFunc'
import eventUsersPaymentsFunc from './modalsFunc/eventUsersPaymentsFunc'
import userPaymentsForEventFunc from './modalsFunc/userPaymentsForEventFunc'
import eventStatusEditFunc from './modalsFunc/eventStatusEditFunc'
import eventUserStatusChangeFunc from './modalsFunc/eventUserStatusChangeFunc'
import eventSignUpWithWarning from './modalsFunc/eventSignUpWithWarning'
import serviceViewFunc from './modalsFunc/serviceViewFunc'
import serviceApplyFunc from './modalsFunc/serviceApplyFunc'
import serviceUserViewFunc from './modalsFunc/serviceUserViewFunc'
import serviceUserFunc from './modalsFunc/serviceUserFunc'
import selectServicesFunc from './modalsFunc/selectServicesFunc'
import serviceUserStatusEditFunc from './modalsFunc/serviceStatusEditFunc'
import userPaymentsFunc from './modalsFunc/userPaymentsFunc'
import userLoginHistoryFunc from './modalsFunc/userLoginHistoryFunc'

const modalsFuncGenerator = (addModal, itemsFunc, router, loggedUser) => {
  const fixEventStatus = (eventId, status) => {
    itemsFunc.event.set({ _id: eventId, status }, false, true)
  }

  const event_signUpToReserveAfterError = (eventId, error) => {
    // console.log('loggedUser', loggedUser)
    // if (!loggedUser?._id)
    //   addModal({
    //     title: 'Необходимо зарегистрироваться и авторизироваться',
    //     text: 'Для записи на мероприятие, необходимо сначала зарегистрироваться, а затем авторизироваться на сайте',
    //     confirmButtonName: 'Зарегистрироваться / Авторизироваться',
    //     onConfirm: () => router.push('/login', '', { shallow: true }),
    //   })
    // else {
    addModal({
      title: `Запись в резерв на мероприятие`,
      text: `К сожалению не удалось записаться на мероприятие в основной состав, так как ${error}. Однако вы можете записаться на мероприятие в резерв, и как только место освободиться вы будете приняты в основной состав. Записаться в резерв на мероприятие?`,
      confirmButtonName: `Записаться в резерв`,
      onConfirm: () => {
        itemsFunc.event.signUp(eventId, loggedUser?._id, 'reserve')
      },
    })
    // }
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
    browserUpdate: (url) =>
      addModal({
        title: 'Устаревшая версия браузера',
        text: `Необходимо обновить браузер. Некоторые функции сайта могут не работать. Пожалуйста обновите браузер.\n\nТекущая версия браузера: ${navigator.userAgent}`,
        confirmButtonName: `Обновить`,
        showConfirm: true,
        showDecline: true,
        onConfirm: () => router.push(url, ''),
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
    selectServices: (
      itemsId,
      filterRules,
      onChange,
      exceptedIds,
      maxServices,
      canSelectNone,
      modalTitle
    ) =>
      addModal(
        selectServicesFunc(
          itemsId,
          filterRules,
          onChange,
          exceptedIds,
          maxServices,
          canSelectNone,
          modalTitle
        )
      ),
    selectPayments: (
      itemsId,
      filterRules,
      onChange,
      exceptedIds,
      maxPayments,
      canSelectNone,
      modalTitle
    ) =>
      addModal(
        selectPaymentsFunc(
          itemsId,
          filterRules,
          onChange,
          exceptedIds,
          maxPayments,
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
      statusEdit: (eventId) => addModal(eventStatusEditFunc(eventId)),
      payments: (eventId) => addModal(eventUsersPaymentsFunc(eventId)),
      close: (eventId) =>
        addModal({
          title: 'Закрытие мероприятия',
          text: 'Вы уверены, что хотите закрыть мероприятие?',
          onConfirm: async () => itemsFunc.event.close(eventId),
        }),
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
      signUpWithWarning: (
        eventId,
        status = 'participant',
        eventSubtypeNum,
        comment
      ) =>
        addModal(
          eventSignUpWithWarning(eventId, status, eventSubtypeNum, comment)
        ),
      signUp: (eventId, status = 'participant', eventSubtypeNum, comment) => {
        if (!loggedUser?._id)
          addModal({
            title: 'Необходимо зарегистрироваться и авторизироваться',
            text: 'Для записи на мероприятие, необходимо сначала зарегистрироваться, а затем авторизироваться на сайте',
            confirmButtonName: 'Авторизироваться',
            confirmButtonName2: 'Зарегистрироваться',
            showConfirm2: true,
            onConfirm: () =>
              router.push(`/login?event=${eventId}`, '', { shallow: true }),
            onConfirm2: () =>
              router.push(`/login?registration=true&event=${eventId}`, '', {
                shallow: true,
              }),
          })
        else {
          const postfixStatus = status === 'reserve' ? ' в резерв' : ''
          addModal({
            title: `Запись${postfixStatus} на мероприятие`,
            text: `Вы уверены что хотите записаться${postfixStatus} на мероприятие?`,
            confirmButtonName: `Записаться${postfixStatus}`,
            onConfirm: () => {
              itemsFunc.event.signUp(
                {
                  eventId,
                  userId: loggedUser?._id,
                  status,
                  userStatus: loggedUser.status,
                  eventSubtypeNum,
                  comment,
                },
                (data) => {
                  if (data.error === 'мероприятие закрыто') {
                    fixEventStatus(eventId, 'closed')
                  }
                  if (data.error === 'мероприятие отменено') {
                    fixEventStatus(eventId, 'canceled')
                  }
                  if (data.solution === 'reserve') {
                    event_signUpToReserveAfterError(eventId, data.error)
                    // addModal({
                    //   title: `Запись в резерв на мероприятие`,
                    //   text: `К сожалению не удалось записаться на мероприятие в основной состав, так как ${error}. Однако вы можете записаться на мероприятие в резерв, и как только место освободиться вы будете приняты в основной состав. Записаться в резерв на мероприятие?`,
                    //   confirmButtonName: `Записаться в резерв`,
                    //   onConfirm: () => {
                    //     itemsFunc.event.signUp(
                    //       eventId,
                    //       loggedUser?._id,
                    //       'reserve'
                    //     )
                    //   },
                    // })
                  }
                }
              )
            },
          })
        }
      },
      // signUpToReserveAfterError: (eventId, error) => {
      //   // console.log('loggedUser', loggedUser)
      //   // if (!loggedUser?._id)
      //   //   addModal({
      //   //     title: 'Необходимо зарегистрироваться и авторизироваться',
      //   //     text: 'Для записи на мероприятие, необходимо сначала зарегистрироваться, а затем авторизироваться на сайте',
      //   //     confirmButtonName: 'Зарегистрироваться / Авторизироваться',
      //   //     onConfirm: () => router.push('/login', '', { shallow: true }),
      //   //   })
      //   // else {
      //   addModal({
      //     title: `Запись в резерв на мероприятие`,
      //     text: `К сожалению не удалось записаться на мероприятие в основной состав, так как ${error}. Однако вы можете записаться на мероприятие в резерв, и как только место освободиться вы будете приняты в основной состав. Записаться в резерв на мероприятие?`,
      //     confirmButtonName: `Записаться в резерв`,
      //     onConfirm: () => {
      //       itemsFunc.event.signUp(eventId, loggedUser?._id, 'reserve')
      //     },
      //   })
      //   // }
      // },
      signOut: (eventId, activeStatus) => {
        if (!loggedUser?._id)
          addModal({
            title: 'Необходимо зарегистрироваться',
            text: 'Для записи на мероприятие, необходимо сначала авторизироваться на сайте',
            confirmButtonName: 'Авторизироваться',
            confirmButtonName2: 'Зарегистрироваться',
            showConfirm2: true,
            onConfirm: () =>
              router.push(`/login?event=${eventId}`, '', { shallow: true }),
            onConfirm2: () =>
              router.push(`/login?registration=true&event=${eventId}`, '', {
                shallow: true,
              }),
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
    eventUser: {
      editStatus: (eventUserId) =>
        addModal(eventUserStatusChangeFunc(eventUserId)),
    },
    payment: {
      add: (paymentId, props) => addModal(paymentFunc(paymentId, true, props)),
      edit: (paymentId) => addModal(paymentFunc(paymentId)),
      autoFill: (eventId) => addModal(paymentsAutoFillFunc(eventId)),
      delete: (paymentId) =>
        addModal({
          title: 'Удаление транзакции',
          text: 'Вы уверены, что хотите удалить транзакцию?',
          onConfirm: async () => itemsFunc.payment.delete(paymentId),
        }),
      userEvent: (userId, eventId) =>
        addModal(userPaymentsForEventFunc(userId, eventId)),
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
      payments: (userId) => addModal(userPaymentsFunc(userId)),
    },
    questionnaire: {
      // add: (questionnaireId) =>
      //   addModal(questionnaireConstructorFunc(questionnaireId, true)),
      open: (questionnaire, value, onConfirm) =>
        addModal(userQuestionnaireFunc(questionnaire, value, onConfirm)),
      constructor: (questionnaire, onConfirm) =>
        addModal(questionnaireConstructorFunc(questionnaire, onConfirm)),
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
    service: {
      add: (serviceId) => addModal(serviceFunc(serviceId, true)),
      edit: (serviceId) => addModal(serviceFunc(serviceId)),
      view: (serviceId) => addModal(serviceViewFunc(serviceId)),
      apply: (serviceId) => {
        if (!loggedUser?._id)
          addModal({
            title: 'Необходимо зарегистрироваться и авторизироваться',
            text: 'Для покупки услуги, необходимо сначала зарегистрироваться, а затем авторизироваться на сайте',
            confirmButtonName: 'Авторизироваться',
            confirmButtonName2: 'Зарегистрироваться',
            showConfirm2: true,
            onConfirm: () =>
              router.push(`/login?service=${serviceId}`, '', { shallow: true }),
            onConfirm2: () =>
              router.push(`/login?registration=true&service=${serviceId}`, '', {
                shallow: true,
              }),
          })
        else addModal(serviceApplyFunc(serviceId))
      },
      delete: (serviceId) =>
        addModal({
          title: 'Удаление услуги',
          text: 'Вы уверены, что хотите удалить услугу?',
          onConfirm: async () => itemsFunc.service.delete(serviceId),
        }),
      buy: (serviceId, userId) =>
        addModal({
          title: 'Покупка услуги',
          text: 'Вы уверены, что хотите приобрести услугу?',
          onConfirm: async () => {
            itemsFunc.service.buy(serviceId, userId)
            addModal({
              title: 'Покупка услуги',
              text: 'Заявка на покупку услуги отправлена! Администратор свяжется с вами в ближайшее время.',
            })
          },
        }),
    },
    serviceUser: {
      add: (serviceId) => addModal(serviceUserFunc(serviceId, true)),
      edit: (serviceId) => addModal(serviceUserFunc(serviceId)),
      view: (serviceUserId) => addModal(serviceUserViewFunc(serviceUserId)),
      delete: (serviceUserId) =>
        addModal({
          title: 'Удаление заявки на услугу',
          text: 'Вы уверены, что хотите удалить заявку на услугу?',
          onConfirm: async () => itemsFunc.servicesUser.delete(serviceUserId),
        }),
      statusEdit: (serviceUserId) =>
        addModal(serviceUserStatusEditFunc(serviceUserId)),
    },
    notifications: {
      telegram: () => addModal(notificationsTelegramFunc()),
    },
    loginHistory: {
      user: (userId) => addModal(userLoginHistoryFunc(userId)),
    },
  }
}

export default modalsFuncGenerator
