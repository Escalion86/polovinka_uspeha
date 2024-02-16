import goToUrlForAddEventToCalendar from '@helpers/goToUrlForAddEventToCalendar'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import addModalSelector from '@state/selectors/addModalSelector'
import { setRecoil } from 'recoil-nexus'
import additionalBlockFunc from './modalsFunc/additionalBlockFunc'
import copyLinkFunc from './modalsFunc/copyLinkFunc'
import cropImageFunc from './modalsFunc/cropImageFunc'
import directionFunc from './modalsFunc/directionFunc'
import directionViewFunc from './modalsFunc/directionViewFunc'
import errorFunc from './modalsFunc/errorFunc'
import eventFunc from './modalsFunc/eventFunc'
import eventSignUpFunc from './modalsFunc/eventSignUpFunc2'
import eventStatusEditFunc from './modalsFunc/eventStatusEditFunc'
import eventUserStatusChangeFunc from './modalsFunc/eventUserStatusChangeFunc'
import eventUsersFunc from './modalsFunc/eventUsersFunc'
import eventUsersPaymentsFunc from './modalsFunc/eventUsersPaymentsFunc'
import eventViewFunc from './modalsFunc/eventViewFunc'
import eventsTagsFunc from './modalsFunc/eventsTagsFunc'
import jsonFunc from './modalsFunc/jsonFunc'
import notificationsDeativateTelegramFunc from './modalsFunc/notificationsDeativateTelegramFunc'
import notificationsTelegramFunc from './modalsFunc/notificationsTelegramFunc'
import paymentFunc from './modalsFunc/paymentFunc'
import paymentsAutoFillFunc from './modalsFunc/paymentsAutoFillFunc'
import questionnaireConstructorFunc from './modalsFunc/questionnaireConstructorFunc'
import reviewFunc from './modalsFunc/reviewFunc'
import selectDirectionsFunc from './modalsFunc/selectDirectionsFunc'
import selectEventsFunc from './modalsFunc/selectEventsFunc'
import selectPaymentsFunc from './modalsFunc/selectPaymentsFunc'
import selectServicesFunc from './modalsFunc/selectServicesFunc'
import selectSvgFrameFunc from './modalsFunc/selectSvgFrameFunc'
import selectUsersFunc from './modalsFunc/selectUsersFunc'
import serviceApplyFunc from './modalsFunc/serviceApplyFunc'
import serviceFunc from './modalsFunc/serviceFunc'
import serviceUserStatusEditFunc from './modalsFunc/serviceStatusEditFunc'
import serviceUserFunc from './modalsFunc/serviceUserFunc'
import serviceUserViewFunc from './modalsFunc/serviceUserViewFunc'
import serviceViewFunc from './modalsFunc/serviceViewFunc'
import userDeleteFunc from './modalsFunc/userDeleteFunc'
import userFunc from './modalsFunc/userFunc'
import userLoginHistoryFunc from './modalsFunc/userLoginHistoryFunc'
import userPaymentsForEventFunc from './modalsFunc/userPaymentsForEventFunc'
import userPaymentsFunc from './modalsFunc/userPaymentsFunc'
import userQuestionnaireFunc from './modalsFunc/userQuestionnaireFunc'
import userSignedUpEventsFunc from './modalsFunc/userSignedUpEventsFunc'
import userViewFunc from './modalsFunc/userViewFunc'
import userSetPasswordFunc from './modalsFunc/userSetPasswordFunc'
// import { useRecoilRefresher_UNSTABLE } from 'recoil'
// import { asyncEventsUsersByEventIdSelector } from '@state/asyncSelectors/asyncEventsUsersByEventIdAtom'
import eventSignUpToReserveAfterError from './modalsFunc/eventSignUpToReserveAfterError'
import roleFunc from './modalsFunc/roleFunc'
import browseLocationFunc from './modalsFunc/browseLocationFunc'
import eventHistoryFunc from './modalsFunc/eventHistoryFunc'
import paymentHistoryFunc from './modalsFunc/paymentHistoryFunc'
import userHistoryFunc from './modalsFunc/userHistoryFunc'
import userActionsHistoryFunc from './modalsFunc/userActionsHistoryFunc'
import userPersonalStatusEditFunc from './modalsFunc/userPersonalStatusEditFunc'
// import likesEditFunc from './modalsFunc/likesEditFunc'
import copyEventUserListFunc from './modalsFunc/copyEventUserListFunc'
import likeEditFunc from './modalsFunc/likeEditFunc'
import likesViewFunc from './modalsFunc/likesViewFunc'
import eventAfterSignUpMessageFunc from './modalsFunc/eventAfterSignUpMessageFunc'
import subEventFunc from './modalsFunc/subEventFunc'
import eventUserSubEventChangeFunc from './modalsFunc/eventUserSubEventChangeFunc'

const modalsFuncGenerator = (
  router,
  itemsFunc,
  loggedUser,
  siteSettings,
  loggedUserActiveRole,
  loggedUserActiveStatus
) => {
  const addModal = (value) => setRecoil(addModalSelector, value)
  // const itemsFunc = getRecoil(itemsFuncAtom)
  // const loggedUser = getRecoil(loggedUserAtom)
  // console.log('loggedUser :>> ', loggedUser)

  const fixEventStatus = (eventId, status) => {
    itemsFunc.event.set({ _id: eventId, status }, false, true)
  }

  // const eventSignUpToReserveAfterError = (
  //   event,
  //   error,
  //   eventSubtypeNum,
  //   comment
  // ) => {
  //   const EventSignUpToReserveAfterErrorModal = ({
  //     closeModal,
  //     setOnConfirmFunc,
  //     setOnConfirm2Func,
  //     setOnDeclineFunc,
  //     setOnShowOnCloseConfirmDialog,
  //     setDisableConfirm,
  //     setDisableDecline,
  //   }) => {
  //     // const loggedUser = useRecoilValue(loggedUserAtom)
  //     // const itemsFunc = useRecoilValue(itemsFuncAtom)

  //     const eventId = event._id

  //     const refreshEventState = useRecoilRefresher_UNSTABLE(
  //       asyncEventsUsersByEventIdSelector(eventId)
  //     )

  //     const onClickConfirm = async (onSuccess) => {
  //       closeModal()
  //       itemsFunc.event.signUp(
  //         {
  //           eventId,
  //           userId: loggedUser?._id,
  //           status: 'reserve',
  //           userStatus: loggedUser.status,
  //           eventSubtypeNum,
  //           comment,
  //         },
  //         (data) => {
  //           if (data.error === 'мероприятие закрыто') {
  //             fixEventStatus(eventId, 'closed')
  //           }
  //           if (data.error === 'мероприятие отменено') {
  //             fixEventStatus(eventId, 'canceled')
  //           }
  //           if (data.solution === 'reserve') {
  //             refreshEventState()
  //             eventSignUpToReserveAfterError(
  //               event,
  //               data.error,
  //               eventSubtypeNum,
  //               comment
  //             )
  //           }
  //         },
  //         (data) => {
  //           if (typeof onSuccess === 'function') onSuccess()
  //         }
  //       )
  //     }

  //     useEffect(() => {
  //       setOnConfirmFunc(onClickConfirm)
  //       setOnConfirm2Func(() =>
  //         onClickConfirm(() => goToUrlForAddEventToCalendar(event))
  //       )
  //     }, [])

  //     return <></>
  //   }

  //   addModal({
  //     title: `Запись в резерв на мероприятие`,
  //     text: `К сожалению не удалось записаться на мероприятие в основной состав, так как ${error}. Однако вы можете записаться на мероприятие в резерв, и как только место освободиться вы будете приняты в основной состав. Записаться в резерв на мероприятие?`,
  //     confirmButtonName: `Записаться в резерв`,
  //     // ADD
  //     confirmButtonName2: `Записаться в резерв и добавить в календарь`,
  //     Children: EventSignUpToReserveAfterErrorModal,
  //     // onConfirm2: () => {
  //     //   itemsFunc.event.signUp(
  //     //     {
  //     //       eventId: event._id,
  //     //       userId: loggedUser?._id,
  //     //       status: 'reserve',
  //     //       userStatus: loggedUser.status,
  //     //       eventSubtypeNum,
  //     //       comment,
  //     //     },
  //     //     undefined,
  //     //     (data) => goToUrlForAddEventToCalendar(event)
  //     //   )
  //     // },
  //     // onConfirm: () => {
  //     //   itemsFunc.event.signUp({
  //     //     eventId: event._id,
  //     //     userId: loggedUser?._id,
  //     //     status: 'reserve',
  //     //     userStatus: loggedUser.status,
  //     //     eventSubtypeNum,
  //     //     comment,
  //     //   })
  //     // },
  //   })
  //   // }
  // }

  const checkLoggedUser = (forWhat = 'Для записи на мероприятие', query) => {
    if (!loggedUser?._id) {
      addModal({
        title: 'Необходимо зарегистрироваться и авторизироваться',
        text: `${forWhat}, необходимо сначала зарегистрироваться, а затем авторизироваться на сайте`,
        confirmButtonName: 'Авторизироваться',
        confirmButtonName2: 'Зарегистрироваться',
        onConfirm: () =>
          router.push(`/login${query ? `?${query}` : ''}`, '', {
            shallow: true,
          }),
        onConfirm2: () =>
          router.push(`/login?registration=true`, '', {
            shallow: true,
          }),
      })
      return false
    } else if (!isUserQuestionnaireFilled(loggedUser)) {
      addModal({
        title: 'Необходимо заполнить профиль',
        text: `${forWhat}, необходимо сначала заполнить профиль`,
        confirmButtonName: 'Заполнить',
        onConfirm: () =>
          router.push(`/cabinet/questionnaire`, '', { shallow: true }),
      })
      return false
    }
    return true
  }

  // const eventSignUp = ({
  //   event,
  //   status = 'participant',
  //   eventSubtypeNum,
  //   comment,
  //   onSuccess,
  // }) => {
  //   const eventId = event._id
  //   itemsFunc.event.signUp(
  //     {
  //       eventId,
  //       userId: loggedUser?._id,
  //       status,
  //       userStatus: loggedUser.status,
  //       eventSubtypeNum,
  //       comment,
  //     },
  //     (data) => {
  //       console.log('data :>> ', data)
  //       if (data.error === 'мероприятие закрыто') {
  //         fixEventStatus(eventId, 'closed')
  //       } else if (data.error === 'мероприятие отменено') {
  //         fixEventStatus(eventId, 'canceled')
  //       } else if (data.solution === 'reserve') {
  //         addModal(
  //           eventSignUpToReserveAfterError(
  //             event,
  //             data.error,
  //             eventSubtypeNum,
  //             comment
  //           )
  //         )
  //         // addModal({
  //         //   title: `Запись в резерв на мероприятие`,
  //         //   text: `К сожалению не удалось записаться на мероприятие в основной состав, так как ${error}. Однако вы можете записаться на мероприятие в резерв, и как только место освободиться вы будете приняты в основной состав. Записаться в резерв на мероприятие?`,
  //         //   confirmButtonName: `Записаться в резерв`,
  //         //   onConfirm: () => {
  //         //     itemsFunc.event.signUp(
  //         //       eventId,
  //         //       loggedUser?._id,
  //         //       'reserve'
  //         //     )
  //         //   },
  //         // })
  //       }
  //     },
  //     (data) => {
  //       if (typeof onSuccess === 'function') onSuccess(data)
  //     }
  //   )
  // }

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
        onConfirm: true,
        showDecline: false,
      }),
    copyLink: (data) => addModal(copyLinkFunc(data)),
    browserUpdate: (url) =>
      addModal({
        title: 'Устаревшая версия браузера',
        text: `Необходимо обновить браузер. Некоторые функции сайта могут не работать. Пожалуйста обновите браузер.\n\nТекущая версия браузера: ${navigator.userAgent}`,
        confirmButtonName: `Обновить`,
        onConfirm: true,
        showDecline: true,
        onConfirm: () => router.push(url, ''),
      }),
    custom: addModal,
    cropImage: (...data) => addModal(cropImageFunc(...data)),
    error: (data) => addModal(errorFunc(data)),
    json: (data) => addModal(jsonFunc(data)),
    selectSvgFrame: (itemId, onChange) =>
      addModal(selectSvgFrameFunc(itemId, onChange)),
    selectEvents: (
      itemsId,
      filterRules,
      onChange,
      exceptedIds,
      acceptedIds,
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
          acceptedIds,
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
      acceptedIds,
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
          acceptedIds,
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
      acceptedIds,
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
          acceptedIds,
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
      acceptedIds,
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
          acceptedIds,
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
      acceptedIds,
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
          acceptedIds,
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
      view: (directionId) => addModal(directionViewFunc(directionId)),
    },
    eventsTags: {
      edit: () => addModal(eventsTagsFunc()),
    },
    event: {
      add: (eventId) => addModal(eventFunc(eventId, true)),
      edit: (eventId) => addModal(eventFunc(eventId)),
      subEventEdit: (props, onChange) =>
        addModal(subEventFunc(props, onChange)),
      users: (eventId) => addModal(eventUsersFunc(eventId)),
      history: (eventId) => addModal(eventHistoryFunc(eventId)),
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
          text: 'Вы уверены, что хотите отменить мероприятие (это не удалит мероприятие, а лишь изменит его статус на отмененное)?',
          onConfirm: async () => itemsFunc.event.cancel(eventId),
        }),
      uncancel: (eventId) =>
        addModal({
          title: 'Возобновление события',
          text: 'Вы уверены, что хотите возобновить мероприятие?',
          onConfirm: async () => itemsFunc.event.uncancel(eventId),
        }),
      delete: (eventId) =>
        addModal({
          title: 'Удаление события',
          text: 'Вы уверены, что хотите удалить мероприятие?',
          onConfirm: async () => itemsFunc.event.delete(eventId),
        }),
      view: (eventId) => addModal(eventViewFunc(eventId)),
      // editLikes: (eventId) => addModal(likesEditFunc(eventId)),
      viewLikes: (eventId) => addModal(likesViewFunc(eventId)),
      copyUsersList: (eventId) => addModal(copyEventUserListFunc(eventId)),
      signUp: (event, status = 'participant', comment) => {
        if (checkLoggedUser('Для записи на мероприятие', `event=${event._id}`))
          addModal(
            eventSignUpFunc(
              event,
              status,
              comment,
              fixEventStatus,
              (event, error, comment, subEventId) =>
                addModal(
                  eventSignUpToReserveAfterError(
                    event,
                    error,
                    comment,
                    subEventId
                  )
                ),
              () => addModal(eventAfterSignUpMessageFunc(event, status))
            )
          )
      },
      // signUp: (event, status = 'participant', eventSubtypeNum, comment) => {
      //   if (
      //     checkLoggedUser('Для записи на мероприятие', `event=${event._id}`)
      //   ) {
      //     const postfixStatus = status === 'reserve' ? ' в резерв' : ''
      //     addModal({
      //       title: `Запись${postfixStatus} на мероприятие`,
      //       text: `Вы уверены что хотите записаться${postfixStatus} на мероприятие?`,
      //       confirmButtonName: `Записаться${postfixStatus}`,
      //       // ADD
      //       confirmButtonName2: `Записаться${postfixStatus} и добавить в календарь`,
      //       onConfirm2: () =>
      //         eventSignUp({
      //           event,
      //           status,
      //           eventSubtypeNum,
      //           comment,
      //           onSuccess: () => goToUrlForAddEventToCalendar(event),
      //         }),
      //       onConfirm: () => {
      //         eventSignUp({
      //           event,
      //           status,
      //           eventSubtypeNum,
      //           comment,
      //           // onSuccess: () => console.log('success'),
      //         })
      //       },
      //     })
      //   }
      // },
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
      signOut: (event, activeStatus) => {
        // if (!loggedUser?._id)
        //   addModal({
        //     title: 'Необходимо зарегистрироваться',
        //     text: 'Для записи на мероприятие, необходимо сначала авторизироваться на сайте',
        //     confirmButtonName: 'Авторизироваться',
        //     confirmButtonName2: 'Зарегистрироваться',
        //     showConfirm2: true,
        //     onConfirm: () =>
        //       router.push(`/login?event=${eventId}`, '', { shallow: true }),
        //     onConfirm2: () =>
        //       router.push(`/login?registration=true&event=${eventId}`, '', {
        //         shallow: true,
        //       }),
        //   })
        // else {
        const postfixStatus = activeStatus === 'reserve' ? ' в резерв' : ''
        addModal({
          title: `Отмена записи${postfixStatus} на мероприятие`,
          text: `Вы уверены что хотите отменить запись${postfixStatus} на мероприятие?`,
          confirmButtonName: `Отменить запись${postfixStatus}`,
          onConfirm: () => {
            itemsFunc.event.signOut(event._id, loggedUser?._id, activeStatus)
          },
        })
        // }
      },
      cantSignUp: () =>
        addModal({
          title: 'Запись на мероприятие невозможна',
          text: 'Ваша учетная запись заблокирована, поэтому вы не можете записываться на мероприятия. Пожалуйста обратитесь к администратору.',
          confirmButtonName: `Понятно`,
          onConfirm: true,
          showDecline: false,
        }),
    },
    eventUser: {
      editStatus: (eventUser) => addModal(eventUserStatusChangeFunc(eventUser)),
      editSubEvent: (eventUser, onConfirm) =>
        addModal(eventUserSubEventChangeFunc(eventUser, onConfirm)),
      editLike: (eventUser, adminView) =>
        addModal(likeEditFunc(eventUser, adminView)),
      likesResult: (eventUser) => addModal(likeEditFunc(eventUser)),
    },
    payment: {
      add: (paymentId, props) => addModal(paymentFunc(paymentId, true, props)),
      edit: (paymentId) => addModal(paymentFunc(paymentId)),
      history: (paymentId) => addModal(paymentHistoryFunc(paymentId)),
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
      history: (userId) => addModal(userHistoryFunc(userId)),
      historyActions: (userId) => addModal(userActionsHistoryFunc(userId)),
      editPersonalStatus: (userId) =>
        addModal(userPersonalStatusEditFunc(userId)),
      delete: (userId) =>
        addModal(
          userDeleteFunc(userId)
          //   {
          //   title: 'Удаление пользователя',
          //   text: 'Вы уверены, что хотите удалить пользователя?',
          //   onConfirm: async () => itemsFunc.user.delete(userId),
          // }
        ),
      view: (userId, params) => addModal(userViewFunc(userId, params)),
      events: (userId) => addModal(userSignedUpEventsFunc(userId)),
      payments: (userId) => addModal(userPaymentsFunc(userId)),
      setPassword: (userId) => addModal(userSetPasswordFunc(userId)),
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
        if (!loggedUser?._id) {
          addModal({
            title: 'Необходимо зарегистрироваться и авторизироваться',
            text: 'Для покупки услуги, необходимо сначала зарегистрироваться, а затем авторизироваться на сайте',
            confirmButtonName: 'Авторизироваться',
            confirmButtonName2: 'Зарегистрироваться',
            onConfirm: () =>
              router.push(`/login?service=${serviceId}`, '', { shallow: true }),
            onConfirm2: () =>
              router.push(`/login?registration=true`, '', {
                shallow: true,
              }),
          })
        } else if (!isUserQuestionnaireFilled(loggedUser))
          addModal({
            title: 'Необходимо заполнить профиль',
            text: 'Для покупки услуги, необходимо сначала заполнить профиль',
            confirmButtonName: 'Заполнить',
            onConfirm: () =>
              router.push(`/cabinet/questionnaire`, '', { shallow: true }),
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
      telegram: {
        activate: (onStartActivate, onCancel) =>
          addModal(notificationsTelegramFunc(onStartActivate, onCancel)),
        deactivate: (onSuccess) =>
          addModal(notificationsDeativateTelegramFunc(onSuccess)),
      },
    },
    loginHistory: {
      user: (userId) => addModal(userLoginHistoryFunc(userId)),
    },
    role: {
      add: (onConfirm) => addModal(roleFunc(undefined, onConfirm)),
      edit: (role, onConfirm) => addModal(roleFunc(role, onConfirm)),
    },
    browseLocation: () => addModal(browseLocationFunc()),
  }
}

export default modalsFuncGenerator
