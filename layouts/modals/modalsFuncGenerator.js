import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import addModalSelector from '@state/selectors/addModalSelector'
import { setRecoil } from 'recoil-nexus'

// import dynamic from 'next/dynamic'
// const additionalBlockFunc = dynamic(
//   () => import('./modalsFunc/additionalBlockFunc')
// )
// const copyLinkFunc = dynamic(() => import('./modalsFunc/copyLinkFunc'))
// const cropImageFunc = dynamic(() => import('./modalsFunc/cropImageFunc'))
// const directionFunc = dynamic(() => import('./modalsFunc/directionFunc'))
// const directionViewFunc = dynamic(
//   () => import('./modalsFunc/directionViewFunc')
// )
// const errorFunc = dynamic(() => import('./modalsFunc/errorFunc'))
// const eventFunc = dynamic(() => import('./modalsFunc/eventFunc'))
// const eventSignUpFunc = dynamic(() => import('./modalsFunc/eventSignUpFunc'))
// const eventStatusEditFunc = dynamic(
//   () => import('./modalsFunc/eventStatusEditFunc')
// )
// const eventUserStatusChangeFunc = dynamic(
//   () => import('./modalsFunc/eventUserStatusChangeFunc')
// )
// const eventUsersFunc = dynamic(() => import('./modalsFunc/eventUsersFunc'))
// const eventUsersPaymentsFunc = dynamic(
//   () => import('./modalsFunc/eventUsersPaymentsFunc')
// )
// const eventViewFunc = dynamic(() => import('./modalsFunc/eventViewFunc'))
// const eventsTagsFunc = dynamic(() => import('./modalsFunc/eventsTagsFunc'))
// const jsonFunc = dynamic(() => import('./modalsFunc/jsonFunc'))
// const notificationsDeativateTelegramFunc = dynamic(
//   () => import('./modalsFunc/notificationsDeativateTelegramFunc')
// )
// const notificationsTelegramFunc = dynamic(
//   () => import('./modalsFunc/notificationsTelegramFunc')
// )
// const paymentFunc = dynamic(() => import('./modalsFunc/paymentFunc'))
// const paymentsAutoFillFunc = dynamic(
//   () => import('./modalsFunc/paymentsAutoFillFunc')
// )
// const questionnaireConstructorFunc = dynamic(
//   () => import('./modalsFunc/questionnaireConstructorFunc')
// )
// const reviewFunc = dynamic(() => import('./modalsFunc/reviewFunc'))
// const selectDirectionsFunc = dynamic(
//   () => import('./modalsFunc/selectDirectionsFunc')
// )
// const selectEventsFunc = dynamic(() => import('./modalsFunc/selectEventsFunc'))
// const selectPaymentsFunc = dynamic(
//   () => import('./modalsFunc/selectPaymentsFunc')
// )
// const selectServicesFunc = dynamic(
//   () => import('./modalsFunc/selectServicesFunc')
// )
// const selectSvgFrameFunc = dynamic(
//   () => import('./modalsFunc/selectSvgFrameFunc')
// )
// const selectUsersFunc = dynamic(() => import('./modalsFunc/selectUsersFunc'))
// const serviceApplyFunc = dynamic(() => import('./modalsFunc/serviceApplyFunc'))
// const serviceFunc = dynamic(() => import('./modalsFunc/serviceFunc'))
// const serviceUserStatusEditFunc = dynamic(
//   () => import('./modalsFunc/serviceUserStatusEditFunc')
// )

// const serviceUserFunc = dynamic(() => import('./modalsFunc/serviceUserFunc'))
// const serviceUserViewFunc = dynamic(
//   () => import('./modalsFunc/serviceUserViewFunc')
// )
// const serviceViewFunc = dynamic(() => import('./modalsFunc/serviceViewFunc'))
// const userDeleteFunc = dynamic(() => import('./modalsFunc/userDeleteFunc'))
// const userFunc = dynamic(() => import('./modalsFunc/userFunc'))
// const userLoginHistoryFunc = dynamic(
//   () => import('./modalsFunc/userLoginHistoryFunc')
// )
// const userPaymentsForEventFunc = dynamic(
//   () => import('./modalsFunc/userPaymentsForEventFunc')
// )
// const userPaymentsFunc = dynamic(() => import('./modalsFunc/userPaymentsFunc'))
// const userQuestionnaireFunc = dynamic(
//   () => import('./modalsFunc/userQuestionnaireFunc')
// )
// const userSignedUpEventsFunc = dynamic(
//   () => import('./modalsFunc/userSignedUpEventsFunc')
// )
// const userViewFunc = dynamic(() => import('./modalsFunc/userViewFunc'))
// const userSetPasswordFunc = dynamic(
//   () => import('./modalsFunc/userSetPasswordFunc')
// )
// const eventSignUpToReserveAfterError = dynamic(
//   () => import('./modalsFunc/eventSignUpToReserveAfterError')
// )
// const roleFunc = dynamic(() => import('./modalsFunc/roleFunc'))
// const browseLocationFunc = dynamic(
//   () => import('./modalsFunc/browseLocationFunc')
// )
// const eventHistoryFunc = dynamic(() => import('./modalsFunc/eventHistoryFunc'))
// const paymentHistoryFunc = dynamic(
//   () => import('./modalsFunc/paymentHistoryFunc')
// )
// const userHistoryFunc = dynamic(() => import('./modalsFunc/userHistoryFunc'))
// const userActionsHistoryFunc = dynamic(
//   () => import('./modalsFunc/userActionsHistoryFunc')
// )
// const userPersonalStatusEditFunc = dynamic(
//   () => import('./modalsFunc/userPersonalStatusEditFunc')
// )
// const copyEventUserListFunc = dynamic(
//   () => import('./modalsFunc/copyEventUserListFunc')
// )
// const likeEditFunc = dynamic(() => import('./modalsFunc/likeEditFunc'))
// const likesViewFunc = dynamic(() => import('./modalsFunc/likesViewFunc'))
// const eventAfterSignUpMessageFunc = dynamic(
//   () => import('./modalsFunc/eventAfterSignUpMessageFunc')
// )
// const subEventFunc = dynamic(() => import('./modalsFunc/subEventFunc'))
// const eventUserSubEventChangeFunc = dynamic(
//   () => import('./modalsFunc/eventUserSubEventChangeFunc')
// )

const modalsFuncGenerator = (
  router,
  itemsFunc,
  loggedUser,
  siteSettings,
  loggedUserActiveRole,
  loggedUserActiveStatus
) => {
  const addModal = (value) => setRecoil(addModalSelector, value)

  const fixEventStatus = (eventId, status) => {
    itemsFunc.event.set({ _id: eventId, status }, false, true)
  }

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
    copyLink: (data) =>
      addModal(require('./modalsFunc/copyLinkFunc').default(data)),
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
    cropImage: (...data) =>
      addModal(require('./modalsFunc/cropImageFunc').default(...data)),
    error: (data) => addModal(require('./modalsFunc/errorFunc').default(data)),
    json: (data) => addModal(require('./modalsFunc/jsonFunc').default(data)),
    selectSvgFrame: (itemId, onChange) =>
      addModal(
        require('./modalsFunc/selectSvgFrameFunc').default(itemId, onChange)
      ),
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
        require('./modalsFunc/selectEventsFunc').default(
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
        require('./modalsFunc/selectUsersFunc').default(
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
        require('./modalsFunc/selectDirectionsFunc').default(
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
        require('./modalsFunc/selectServicesFunc').default(
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
        require('./modalsFunc/selectPaymentsFunc').default(
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
      add: (reviewId) =>
        addModal(require('./modalsFunc/reviewFunc').default(reviewId, true)),
      edit: (reviewId) =>
        addModal(require('./modalsFunc/reviewFunc').default(reviewId)),
      delete: (reviewId) =>
        addModal({
          title: 'Удаление отзыва',
          text: 'Вы уверены, что хотите удалить отзыв?',
          onConfirm: async () => itemsFunc.review.delete(reviewId),
        }),
    },
    direction: {
      add: (directionId) =>
        addModal(
          require('./modalsFunc/directionFunc').default(directionId, true)
        ),
      edit: (directionId) =>
        addModal(require('./modalsFunc/directionFunc').default(directionId)),
      delete: (directionId) =>
        addModal({
          title: 'Удаление направления',
          text: 'Вы уверены, что хотите удалить направление?',
          onConfirm: async () => itemsFunc.direction.delete(directionId),
        }),
      view: (directionId) =>
        addModal(
          require('./modalsFunc/directionViewFunc').default(directionId)
        ),
    },
    eventsTags: {
      edit: () => addModal(require('./modalsFunc/eventsTagsFunc').default()),
    },
    event: {
      add: (eventId) =>
        addModal(require('./modalsFunc/eventFunc').default(eventId, true)),
      edit: (eventId) =>
        addModal(require('./modalsFunc/eventFunc').default(eventId)),
      subEventEdit: (props, onChange) =>
        addModal(require('./modalsFunc/subEventFunc').default(props, onChange)),
      users: (eventId) =>
        addModal(require('./modalsFunc/eventUsersFunc').default(eventId)),
      history: (eventId) =>
        addModal(require('./modalsFunc/eventHistoryFunc').default(eventId)),
      statusEdit: (eventId) =>
        addModal(require('./modalsFunc/eventStatusEditFunc').default(eventId)),
      payments: (eventId) =>
        addModal(
          require('./modalsFunc/eventUsersPaymentsFunc').default(eventId)
        ),
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
      view: (eventId) =>
        addModal(require('./modalsFunc/eventViewFunc').default(eventId)),
      // editLikes: (eventId) => addModal(require('./modalsFunc/likesEditFunc').default(eventId)),
      viewLikes: (eventId) =>
        addModal(require('./modalsFunc/likesViewFunc').default(eventId)),
      copyUsersList: (eventId) =>
        addModal(
          require('./modalsFunc/copyEventUserListFunc').default(eventId)
        ),
      signUp: (event, status = 'participant', comment) => {
        if (checkLoggedUser('Для записи на мероприятие', `event=${event._id}`))
          addModal(
            require('./modalsFunc/eventSignUpFunc').default(
              event,
              status,
              comment,
              fixEventStatus,
              (event, error, comment, subEventId) =>
                addModal(
                  require('./modalsFunc/eventSignUpToReserveAfterError').default(
                    event,
                    error,
                    comment,
                    subEventId
                  )
                ),
              () =>
                addModal(
                  require('./modalsFunc/eventAfterSignUpMessageFunc').default(
                    event,
                    status
                  )
                )
            )
          )
      },
      signOut: (event, activeStatus) => {
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
      editStatus: (eventUser) =>
        addModal(
          require('./modalsFunc/eventUserStatusChangeFunc').default(eventUser)
        ),
      editSubEvent: (eventUser, onConfirm) =>
        addModal(
          require('./modalsFunc/eventUserSubEventChangeFunc').default(
            eventUser,
            onConfirm
          )
        ),
      editLike: (eventUser, adminView) =>
        addModal(
          require('./modalsFunc/likeEditFunc').default(eventUser, adminView)
        ),
      likesResult: (eventUser) =>
        addModal(require('./modalsFunc/likeEditFunc').default(eventUser)),
    },
    payment: {
      add: (paymentId, props) =>
        addModal(
          require('./modalsFunc/paymentFunc').default(paymentId, true, props)
        ),
      edit: (paymentId) =>
        addModal(require('./modalsFunc/paymentFunc').default(paymentId)),
      history: (paymentId) =>
        addModal(require('./modalsFunc/paymentHistoryFunc').default(paymentId)),
      autoFill: (eventId) =>
        addModal(require('./modalsFunc/paymentsAutoFillFunc').default(eventId)),
      delete: (paymentId) =>
        addModal({
          title: 'Удаление транзакции',
          text: 'Вы уверены, что хотите удалить транзакцию?',
          onConfirm: async () => itemsFunc.payment.delete(paymentId),
        }),
      userEvent: (userId, eventId) =>
        addModal(
          require('./modalsFunc/userPaymentsForEventFunc').default(
            userId,
            eventId
          )
        ),
    },
    user: {
      add: (userId) =>
        addModal(require('./modalsFunc/userFunc').default(userId, true)),
      edit: (userId) =>
        addModal(require('./modalsFunc/userFunc').default(userId)),
      history: (userId) =>
        addModal(require('./modalsFunc/userHistoryFunc').default(userId)),
      historyActions: (userId) =>
        addModal(
          require('./modalsFunc/userActionsHistoryFunc').default(userId)
        ),
      editPersonalStatus: (userId) =>
        addModal(
          require('./modalsFunc/userPersonalStatusEditFunc').default(userId)
        ),
      delete: (userId) =>
        addModal(
          require('./modalsFunc/userDeleteFunc').default(userId)
          //   {
          //   title: 'Удаление пользователя',
          //   text: 'Вы уверены, что хотите удалить пользователя?',
          //   onConfirm: async () => itemsFunc.user.delete(userId),
          // }
        ),
      view: (userId, params) =>
        addModal(require('./modalsFunc/userViewFunc').default(userId, params)),
      events: (userId) =>
        addModal(
          require('./modalsFunc/userSignedUpEventsFunc').default(userId)
        ),
      payments: (userId) =>
        addModal(require('./modalsFunc/userPaymentsFunc').default(userId)),
      setPassword: (userId) =>
        addModal(require('./modalsFunc/userSetPasswordFunc').default(userId)),
    },
    questionnaire: {
      // add: (questionnaireId) =>
      //   addModal(require('./modalsFunc/questionnaireConstructorFunc').default(questionnaireId, true)),
      open: (questionnaire, value, onConfirm) =>
        addModal(
          require('./modalsFunc/userQuestionnaireFunc').default(
            questionnaire,
            value,
            onConfirm
          )
        ),
      constructor: (questionnaire, onConfirm) =>
        addModal(
          require('./modalsFunc/questionnaireConstructorFunc').default(
            questionnaire,
            onConfirm
          )
        ),
    },
    additionalBlock: {
      add: (additionalBlockId) =>
        addModal(
          require('./modalsFunc/additionalBlockFunc').default(
            additionalBlockId,
            true
          )
        ),
      edit: (additionalBlockId) =>
        addModal(
          require('./modalsFunc/additionalBlockFunc').default(additionalBlockId)
        ),
      delete: (additionalBlockId) =>
        addModal({
          title: 'Удаление дополнительного блока',
          text: 'Вы уверены, что хотите удалить дополнительный блок?',
          onConfirm: async () =>
            itemsFunc.additionalBlock.delete(additionalBlockId),
        }),
    },
    service: {
      add: (serviceId) =>
        addModal(require('./modalsFunc/serviceFunc').default(serviceId, true)),
      edit: (serviceId) =>
        addModal(require('./modalsFunc/serviceFunc').default(serviceId)),
      view: (serviceId) =>
        addModal(require('./modalsFunc/serviceViewFunc').default(serviceId)),
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
        else
          addModal(require('./modalsFunc/serviceApplyFunc').default(serviceId))
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
      add: (serviceId) =>
        addModal(
          require('./modalsFunc/serviceUserFunc').default(serviceId, true)
        ),
      edit: (serviceId) =>
        addModal(require('./modalsFunc/serviceUserFunc').default(serviceId)),
      view: (serviceUserId) =>
        addModal(
          require('./modalsFunc/serviceUserViewFunc').default(serviceUserId)
        ),
      delete: (serviceUserId) =>
        addModal({
          title: 'Удаление заявки на услугу',
          text: 'Вы уверены, что хотите удалить заявку на услугу?',
          onConfirm: async () => itemsFunc.servicesUser.delete(serviceUserId),
        }),
      statusEdit: (serviceUserId) =>
        addModal(
          require('./modalsFunc/serviceUserStatusEditFunc').default(
            serviceUserId
          )
        ),
    },
    notifications: {
      telegram: {
        activate: (onStartActivate, onCancel) =>
          addModal(
            require('./modalsFunc/notificationsTelegramFunc').default(
              onStartActivate,
              onCancel
            )
          ),
        deactivate: (onSuccess) =>
          addModal(
            require('./modalsFunc/notificationsDeativateTelegramFunc').default(
              onSuccess
            )
          ),
      },
    },
    loginHistory: {
      user: (userId) =>
        addModal(require('./modalsFunc/userLoginHistoryFunc').default(userId)),
    },
    role: {
      add: (onConfirm) =>
        addModal(
          require('./modalsFunc/roleFunc').default(undefined, onConfirm)
        ),
      edit: (role, onConfirm) =>
        addModal(require('./modalsFunc/roleFunc').default(role, onConfirm)),
    },
    template: {
      select: (tool, onSelect) =>
        addModal(
          require('./modalsFunc/selectTemplateFunc').default(tool, onSelect)
        ),
      save: (tool, template, onConfirm) => {
        addModal(
          require('./modalsFunc/saveTemplateFunc').default(
            tool,
            template,
            onConfirm
          )
        )
      },
    },
    browseLocation: () =>
      addModal(require('./modalsFunc/browseLocationFunc').default()),
  }
}

export default modalsFuncGenerator
